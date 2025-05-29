const { bucket } = require("../config/firebase.js");

const deleteImage = async (imageUrl) => {
  if (!imageUrl) return false;

  try {
    const decodedUrl = decodeURIComponent(imageUrl);
    const urlParts = decodedUrl.split("/");

    const bucketIndex = urlParts.findIndex((part) => part === bucket.name);
    if (bucketIndex === -1) throw new Error("Bucket name tidak ditemukan di URL");

    const filePath = urlParts.slice(bucketIndex + 1).join("/");

    if (!filePath) throw new Error("Path file tidak ditemukan di URL");

    await bucket.file(filePath).delete();
    console.log(`File '${filePath}' berhasil dihapus dari Firebase Storage.`);
    return true;
  } catch (error) {
    console.error("Gagal menghapus gambar dari Firebase Storage:", error);
    return false;
  }
};

module.exports = deleteImage;
