const db = require("../config/firebase.js");

const addKue = async (request, h) => {
  const { nama, deskripsi } = request.payload;

  try {
    const docRef = await db.collection("kue").add({ nama, deskripsi });
    return h
      .response({ id: docRef.id, message: "Kue berhasil ditambahkan" })
      .code(201);
  } catch (error) {
    console.error("Gagal tambah kue:", error);
    return h.response({ error: "Gagal menambahkan kue" }).code(500);
  }
};

const getAllKue = async (request, h) => {
  try {
    const snapshot = await db.collection('kue').get();
    const kueList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (kueList.length === 0) {
      return h.response({ message: 'Tidak ada kue dalam database' }).code(404);
    }

    return h.response(kueList).code(200);
  } catch (error) {
    console.error('Gagal mengambil data kue:', error);
    return h.response({ error: 'Gagal mengambil data kue' }).code(500);
  }
};

module.exports = {
  addKue,getAllKue
};
