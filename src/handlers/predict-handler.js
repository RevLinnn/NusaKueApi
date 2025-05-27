const { predictImageClass } = require("../services/modelService");
const { db } = require("../config/firebase");
const incrementPredictionCount = require("../utils/predictionCounter");

const predict = async (request, h) => {
  const { image } = request.payload;

  if (!image || !(image instanceof Buffer)) {
    return h
      .response({
        status: "fail",
        message: "File gambar tidak diunggah atau format gambar tidak valid.",
      })
      .code(400);
  }

  try {
    const result = await predictImageClass(image);

    if (result.error) {
      return h
        .response({
          status: "fail",
          message: result.error || "Terjadi kesalahan saat melakukan prediksi.",
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
          status: "fail",
          message: "Kue tidak ditemukan.",
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
      created_at: new Date().toISOString(),
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
        status: "success",
        message: "Prediksi berhasil dilakukan.",
        data,
      })
      .code(200);
  } catch (error) {
    console.error("Prediction error:", error);
    return h
      .response({
        status: "error",
        message: "Terjadi kesalahan server saat proses prediksi.",
        detail: error.message,
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
      const dataCake = cakeDoc.data();

      return {
        id: cakeDoc.id,
        count,
        ...dataCake,
      };
    });

    const topCakes = await Promise.all(topCakesPromises);

    return h
      .response({
        status: "success",
        message: "Data prediksi teratas berhasil diambil.",
        data: topCakes,
      })
      .code(200);
  } catch (error) {
    console.error("Error fetching top predictions:", error);
    return h
      .response({
        status: "error",
        message: "Gagal mengambil data prediksi teratas.",
        detail: error.message,
      })
      .code(500);
  }
};

module.exports = {
  predict,
  getTopPredictions,
};
