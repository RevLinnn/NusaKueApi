const { predictImageClass } = require("../services/modelService");
const db = require("../config/firebase");

const predict = async (request, h) => {
  const { image } = request.payload;

  if (!image || !(image instanceof Buffer)) {
    return h.response({
      status: "fail",
      message: "No image file uploaded or invalid image format",
    }).code(400);
  }

  try {
    const result = await predictImageClass(image);

    if (result.error) {
      return h.response({
        status: "fail",
        message: result.error || "Unknown prediction error",
      }).code(400);
    }

    const { predicted: predictedLabel, confidence } = result;
    const score = (confidence * 100).toFixed(2) + "%";

    const snapshot = await db
      .collection("detailkue")
      .where("nama", "==", predictedLabel)
      .get();

    if (snapshot.empty) {
      return h.response({
        status: "fail",
        message: "Cake not found",
      }).code(404);
    }

    const doc = snapshot.docs[0];
    const { deskripsi } = doc.data();

    const data = {
      id: doc.id,
      nama: predictedLabel,
      skor: score,
      confidence,
      deskripsi,
    };

    return h.response({
      status: "success",
      data: data,
    }).code(200);
  } catch (err) {
    console.error("Prediction error:", err);
    return h.response({
      status: "error",
      message: "Internal server error during prediction",
      detail: err.message,
    }).code(500);
  }
};

module.exports = { predict };
