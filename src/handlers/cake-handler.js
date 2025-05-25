const { db, bucket } = require("../config/firebase.js");
const uploadImageToFirebase = require("../utils/uploadImage.js");

const addKue = async (req, h) => {
  try {
    let {
      nama,
      asal,
      bahan_pembuatan,
      budaya,
      cara_pembuatan,
      deskripsi,
    } = req.payload;

    if (
      !nama ||
      !asal ||
      !bahan_pembuatan ||
      !budaya ||
      !cara_pembuatan ||
      !deskripsi
    ) {
      return h.response({ message: "Data tidak lengkap." }).code(400);
    }

    try {
      asal = JSON.parse(asal);
      bahan_pembuatan = JSON.parse(bahan_pembuatan);
    } catch (err) {
      return h
        .response({
          message: "Field asal dan bahan_pembuatan harus berupa array JSON yang valid.",
        })
        .code(400);
    }

    if (!Array.isArray(asal) || !Array.isArray(bahan_pembuatan)) {
      return h
        .response({
          message: "Field asal dan bahan_pembuatan harus berupa array.",
        })
        .code(400);
    }

    const existingKueSnapshot = await db.collection("cakes").where("nama", "==", nama).get();

    if (!existingKueSnapshot.empty) {
      return h
        .response({
          message: `Kue dengan nama '${nama}' sudah ada.`,
        })
        .code(409);
    }

    const image = req.payload.image;
    const imageUrl = await uploadImageToFirebase(image, bucket, "cakes");

    const docRef = db.collection("cakes").doc();
    const docId = docRef.id;

    const newKue = {
      id: docId,
      nama,
      asal,
      bahan_pembuatan,
      budaya,
      cara_pembuatan,
      deskripsi,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    };

    await docRef.set(newKue);

    return h
      .response({
        message: "Kue berhasil ditambahkan.",
        data: newKue,
      })
      .code(201);
  } catch (error) {
    console.error("Error addKue:", error);
    return h.response({ message: "Gagal menambahkan kue." }).code(500);
  }
};

const getAllKue = async (req, h) => {
  try {
    const snapshot = await db.collection("cakes").get();
    const cakeList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (cakeList.length === 0) {
      return h.response({ message: "Tidak ada kue yang ditemukan." }).code(404);
    }

    return h
      .response({
        message: "Berhasil mengambil data kue.",
        data: cakeList,
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: "Gagal mengambil data kue." }).code(500);
  }
};

const getCakeById = async (req, h) => {
  try {
    const { id } = req.params;

    const cakeDoc = await db.collection("cakes").doc(id).get();

    if (!cakeDoc.exists) {
      return h.response({ message: "Kue tidak ditemukan." }).code(404);
    }

    return h
      .response({
        message: "Berhasil mengambil data kue.",
        data: {
          id: cakeDoc.id,
          ...cakeDoc.data(),
        },
      })
      .code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: "Gagal mengambil data kue." }).code(500);
  }
};

module.exports = {
  getAllKue,
  getCakeById,
  addKue,
};
