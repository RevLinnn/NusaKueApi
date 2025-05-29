const Hapi = require('@hapi/hapi');
const predictRoutes = require('../routes/predict-route.js');
const cakeRoutes = require('../routes/cake-route.js');
const umkmRoutes = require('../routes/umkm-route.js');
const  recommendationRoutes = require('../routes/recommendation-route.js');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
      payload: {
        maxBytes: 5242880,
        parse: true,
        output: 'data',
        multipart: true,
      }
    }
  });
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.response({
        message: 'Hello World!',
      }).code(200);
    }
  });
  server.route(predictRoutes);
  server.route(cakeRoutes);
  server.route(umkmRoutes);
  server.route(recommendationRoutes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
