const tf = require("@tensorflow/tfjs-node");
const sharp = require("sharp");
const { MODEL_PATH, LABEL } = require("../config/modelConfig");

let model;
const CONFIDENCE_THRESHOLD = 0.8;

const loadModel = async () => {
  if (!model) {
    try {
      model = await tf.loadLayersModel(MODEL_PATH);
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Error loading model:", error);
      throw new Error("Failed to load model");
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
    console.error("Error during image preprocessing:", error);
    throw new Error("Unsupported or corrupt image");
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
    } else {
      return {
        predicted: "Unknown",
        confidence,
        message: `Confidence (${(confidence * 100).toFixed(2)}%) is below the threshold of ${(CONFIDENCE_THRESHOLD * 100).toFixed(0)}%.`,
      };
    }
  } catch (error) {
    console.error("Prediction failed:", error);
    throw new Error("Prediction failed");
  }
};

module.exports = {
  loadModel,
  predictImageClass,
};
