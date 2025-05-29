const { db, bucket } = require("../config/firebase.js");
const uploadImageToFirebase = require("../utils/uploadImage.js");
const deleteImage = require("../utils/deleteImage.js");

const addUmkm = async (req, h) => {
  try {
    let { nama, alamat, no_telp, paling_diminati } = req.payload;
    const image = req.payload.image;

    if (!nama || !alamat || !no_telp || !paling_diminati) {
      return h.response({
        status: "fail",
        message: "Data tidak lengkap.",
      }).code(400);
    }

    try {
      if (typeof paling_diminati === "string") {
        paling_diminati = JSON.parse(paling_diminati);
      }
    } catch (err) {
      return h.response({
        status: "fail",
        message: "Field 'paling_diminati' harus berupa array JSON yang valid.",
      }).code(400);
    }

    if (!Array.isArray(paling_diminati)) {
      return h.response({
        status: "fail",
        message: "Field 'paling_diminati' harus berupa array.",
      }).code(400);
    }

    const existingUmkmSnapshot = await db
      .collection("umkm")
      .where("nama", "==", nama)
      .get();

    if (!existingUmkmSnapshot.empty) {
      return h.response({
        status: "fail",
        message: `UMKM dengan nama '${nama}' sudah terdaftar.`,
      }).code(409);
    }

    let image_url = null;
    if (image && image.hapi) {
      image_url = await uploadImageToFirebase(image, bucket, "umkms");
    }

    const docRef = db.collection("umkm").doc();
    const docId = docRef.id;

    const newUmkm = {
      id: docId,
      nama,
      alamat,
      no_telp,
      paling_diminati,
      image_url,
      created_at: new Date().toISOString(),
    };

    await docRef.set(newUmkm);

    return h.response({
      status: "success",
      message: "UMKM berhasil ditambahkan.",
      data: newUmkm,
    }).code(201);

  } catch (error) {
    console.error("Error addUmkm:", error);
    return h.response({
      status: "error",
      message: "Terjadi kesalahan saat menambahkan UMKM.",
    }).code(500);
  }
};

const getAllUmkm = async (req, h) => {
  try {
    const snapshot = await db.collection("umkm").get();
    const umkmList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (umkmList.length === 0) {
      return h.response({
        status: "fail",
        message: "Tidak ada data UMKM yang tersedia.",
      }).code(404);
    }

    return h.response({
      status: "success",
      message: "Data UMKM berhasil diambil.",
      data: umkmList,
    }).code(200);

  } catch (error) {
    console.error("Error getAllUmkm:", error);
    return h.response({
      status: "error",
      message: "Terjadi kesalahan saat mengambil data UMKM.",
    }).code(500);
  }
};

const getUmkmById = async (req, h) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || id.trim() === "") {
    return h.response({
      status: "fail",
      message: "ID UMKM tidak valid.",
    }).code(400);
  }

  try {
    const doc = await db.collection("umkm").doc(id).get();

    if (!doc.exists) {
      return h.response({
        status: "fail",
        message: "UMKM tidak ditemukan.",
      }).code(404);
    }

    return h.response({
      status: "success",
      message: "Data UMKM berhasil diambil.",
      data: {
        id: doc.id,
        ...doc.data(),
      },
    }).code(200);

  } catch (error) {
    console.error("Error getUmkmById:", error);
    return h.response({
      status: "error",
      message: "Terjadi kesalahan saat mengambil data UMKM.",
    }).code(500);
  }
};

const updateUmkmById = async (req, h) => {
  try {
    const { id } = req.params;
    let { nama, alamat, no_telp, paling_diminati } = req.payload;
    const image = req.payload.image;

    if (!id || typeof id !== "string" || id.trim() === "") {
      return h.response({
        status: "fail",
        message: "ID UMKM tidak valid.",
      }).code(400);
    }

    if (!nama || !alamat || !no_telp || !paling_diminati) {
      return h.response({
        status: "fail",
        message: "Data tidak lengkap.",
      }).code(400);
    }

    try {
      if (typeof paling_diminati === "string") {
        paling_diminati = JSON.parse(paling_diminati);
      }
    } catch {
      return h.response({
        status: "fail",
        message: "Field 'paling_diminati' harus berupa array JSON yang valid.",
      }).code(400);
    }

    if (!Array.isArray(paling_diminati)) {
      return h.response({
        status: "fail",
        message: "Field 'paling_diminati' harus berupa array.",
      }).code(400);
    }

    const docRef = db.collection("umkm").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return h.response({
        status: "fail",
        message: "UMKM tidak ditemukan.",
      }).code(404);
    }

    let image_url = docSnap.data().image_url || null;

    if (image && image.hapi) {
      if (image_url) {
        try {
          await deleteImage(image_url);
        } catch (err) {
          console.warn("Gagal menghapus gambar lama:", err.message);
        }
      }

      image_url = await uploadImageToFirebase(image, bucket, "umkms");
    }

    await docRef.update({
      nama,
      alamat,
      no_telp,
      paling_diminati,
      image_url,
      updated_at: new Date().toISOString(),
    });

    return h.response({
      status: "success",
      message: "UMKM berhasil diperbarui.",
    }).code(200);
  } catch (error) {
    console.error("Error updateUmkmById:", error);
    return h.response({
      status: "error",
      message: "Terjadi kesalahan saat memperbarui data UMKM.",
      detail: error.message,
    }).code(500);
  }
};

const deleteUmkmById = async (req, h) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string" || id.trim() === "") {
      return h.response({
        status: "fail",
        message: "ID UMKM tidak valid.",
      }).code(400);
    }

    const docRef = db.collection("umkm").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return h.response({
        status: "fail",
        message: "UMKM tidak ditemukan.",
      }).code(404);
    }

    const image_url = docSnap.data().image_url;
    if (image_url) {
      try {
        await deleteImage(image_url);
      } catch (err) {
        console.warn("Gagal menghapus gambar saat menghapus UMKM:", err.message);
      }
    }

    await docRef.delete();

    return h.response({
      status: "success",
      message: "UMKM berhasil dihapus.",
    }).code(200);
  } catch (error) {
    console.error("Error deleteUmkmById:", error);
    return h.response({
      status: "error",
      message: "Terjadi kesalahan saat menghapus data UMKM.",
      detail: error.message,
    }).code(500);
  }
};

module.exports = {
  getAllUmkm,
  addUmkm,
  getUmkmById,
  updateUmkmById,
  deleteUmkmById
};
