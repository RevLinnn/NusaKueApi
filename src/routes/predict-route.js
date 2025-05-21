const { predict } = require('../handlers/predict-handler.js');

const routes = {
  method: 'POST',
  path: '/predict',
  options: {
    payload: {
      maxBytes: 10 * 1024 * 1024,
      parse: true,
      allow: 'multipart/form-data',
      output: 'data',
    },
  },
  handler: predict,
};

module.exports = routes;
