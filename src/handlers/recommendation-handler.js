const { db } = require("../config/firebase.js");

const getRecomendedUmkm = async (req, h) => {
  const { id } = req.params;

  try {
    const cakeDoc = await db.collection("cakes").doc(id).get();

    if (!cakeDoc.exists) {
      return h.response({
        status: "fail",
        message: "Kue tidak ditemukan.",
      }).code(404);
    }

    const cakeData = cakeDoc.data();
    const namaKue = cakeData.nama;

    const umkmSnapshot = await db
      .collection("umkm")
      .where("paling_diminati", "array-contains", namaKue)
      .get();

    const umkmList = umkmSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return h.response({
      status: "success",
      message: umkmList.length > 0
        ? "Data UMKM berdasarkan kue berhasil diambil."
        : "Belum ada UMKM yang menyediakan kue ini.",
      data: umkmList,
    }).code(200);

  } catch (error) {
    console.error("Error getUmkmByCakeId:", error);
    return h.response({
      status: "error",
      message: "Terjadi kesalahan saat mengambil data UMKM berdasarkan kue.",
    }).code(500);
  }
};

module.exports = {
  getRecomendedUmkm,
};