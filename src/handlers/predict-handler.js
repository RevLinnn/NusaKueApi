const { predictImageClass } = require("../services/modelService");
const { db } = require("../config/firebase");
const incrementPredictionCount = require("../utils/predictionCounter");

const predict = async (request, h) => {
  const { image } = request.payload;

  if (!image || !(image instanceof Buffer)) {
    return h
      .response({
        status: "gagal",
        message: "File gambar tidak diunggah atau format gambar tidak valid",
      })
      .code(400);
  }

  try {
    const result = await predictImageClass(image);

    if (result.error) {
      return h
        .response({
          status: "gagal",
          message: result.error || "Terjadi kesalahan saat prediksi",
        })
        .code(400);
    }

    const { predicted: predictedLabel, confidence } = result;
    const score = (confidence * 100).toFixed(2) + "%";

    const snapshot = await db
      .collection("cakes")
      .where("nama", "==", predictedLabel)
      .get();

    if (snapshot.empty) {
      return h
        .response({
          status: "gagal",
          message: "Kue tidak ditemukan",
        })
        .code(404);
    }

    const doc = snapshot.docs[0];
    const { deskripsi, image_url, asal } = doc.data();

    const data = {
      id_kue: doc.id,
      nama: predictedLabel,
      skor: score,
      deskripsi,
      asal,
      image_url,
      create_at: new Date().toISOString(),
    };

    await db.collection("predictions").add({
      timestamp: new Date(),
      nama: predictedLabel,
      confidence,
      skor: score,
      deskripsi,
    });

    await incrementPredictionCount(predictedLabel);

    return h
      .response({
        status: "sukses",
        data,
      })
      .code(200);
  } catch (err) {
    console.error("Prediction error:", err);
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan server saat proses prediksi",
        detail: err.message,
      })
      .code(500);
  }
};

const getTopPredictions = async (request, h) => {
  try {
    const snapshot = await db
      .collection("predictionCounts")
      .orderBy("count", "desc")
      .limit(5)
      .get();

    const topCakesPromises = snapshot.docs.map(async (doc) => {
      const nama = doc.id;
      const count = doc.data().count;

      const cakeSnapshot = await db
        .collection("cakes")
        .where("nama", "==", nama)
        .get();

      if (cakeSnapshot.empty) {
        return {
          id: null,
          nama,
          count,
          asal: null,
          image_url: null,
        };
      }

      const cakeDoc = cakeSnapshot.docs[0];
      const { asal, image_url } = cakeDoc.data();

      return {
        id: cakeDoc.id,
        nama,
        count,
        asal,
        image_url,
      };
    });

    const topCakes = await Promise.all(topCakesPromises);

    return h.response({
      status: "sukses",
      data: topCakes,
    });
  } catch (err) {
    console.error("Error fetching top predictions:", err);
    return h
      .response({
        status: "error",
        message: "Gagal mengambil data prediksi teratas",
        detail: err.message,
      })
      .code(500);
  }
};

module.exports = {
  predict,
  getTopPredictions,
};
