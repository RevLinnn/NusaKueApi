const db = require("../config/firebase.js");

const getAllUmkm = async (req, h) => {
  try {
    const snapshot = await db.collection('umkm').get();
    const umkmList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (umkmList.length === 0) {
      return h.response({
        message: 'Data UMKM tidak ditemukan'
      }).code(404);
    }

    return h.response({
      message: 'Berhasil mengambil data UMKM',
      data: umkmList
    }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({
      message: 'Gagal mengambil data UMKM'
    }).code(500);
  }
};

const getUmkmById = async (req, h) => {
  const { id } = req.params;
  try {
    const doc = await db.collection('umkm').doc(id).get();

    if (!doc.exists) {
      return h.response({
        message: 'UMKM tidak ditemukan'
      }).code(404);
    }

    return h.response({
      message: 'Berhasil mengambil data UMKM',
      data: {
        id: doc.id,
        ...doc.data()
      }
    }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({
      message: 'Gagal mengambil data UMKM'
    }).code(500);
  }
};

module.exports = {
  getAllUmkm,
  getUmkmById
};
