const { predict, getTopPredictions } = require('../handlers/predict-handler.js');


const routes = [
  {
    method: "POST",
    path: "/predict",
    options: {
      payload: {
        maxBytes: 5 * 1024 * 1024,
        parse: true,
        allow: "multipart/form-data",
        output: "data",
      },
    },
    handler: predict,
  },
  {
    method: "GET",
    path: "/top-predictions",
    handler: getTopPredictions,
  },
];

module.exports = routes;
