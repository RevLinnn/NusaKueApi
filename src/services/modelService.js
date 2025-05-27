const tf = require("@tensorflow/tfjs-node");
const sharp = require("sharp");
const { MODEL_PATH, LABEL } = require("../config/modelConfig");

let model;
const CONFIDENCE_THRESHOLD = 0.7;

const loadModel = async () => {
  if (!model) {
    try {
      model = await tf.loadLayersModel(MODEL_PATH);
      console.log("Model berhasil dimuat");
    } catch (error) {
      console.error("Gagal memuat model:", error);
      throw new Error("Gagal memuat model");
    }
  }
  return model;
};

const preprocessImage = async (buffer) => {
  try {
    const { data, info } = await sharp(buffer)
      .resize(224, 224)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const imageTensor = tf.tensor3d(data, [info.height, info.width, info.channels], "int32");
    const normalized = imageTensor.div(tf.scalar(255));
    const batched = normalized.expandDims(0);

    imageTensor.dispose();

    return batched;
  } catch (error) {
    console.error("Gagal memproses gambar:", error);
    throw new Error("Gambar tidak didukung atau rusak");
  }
};

const predictImageClass = async (imageBuffer) => {
  try {
    const model = await loadModel();
    const tensor = await preprocessImage(imageBuffer);

    const prediction = model.predict(tensor);
    const scores = prediction.dataSync();

    const maxIdx = scores.indexOf(Math.max(...scores));
    const confidence = scores[maxIdx];

    prediction.dispose();
    tensor.dispose();

    if (confidence >= CONFIDENCE_THRESHOLD) {
      return {
        predicted: LABEL[maxIdx],
        confidence,
      };
    }

    return {
      predicted: "Unknown",
      confidence,
      message: `Confidence (${(confidence * 100).toFixed(2)}%) di bawah threshold ${(CONFIDENCE_THRESHOLD * 100).toFixed(0)}%.`,
    };
  } catch (error) {
    console.error("Prediksi gagal:", error);
    throw new Error("Prediksi gagal");
  }
};

module.exports = {
  loadModel,
  predictImageClass,
};
