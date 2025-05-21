const Hapi = require('@hapi/hapi');
const predictRoutes = require('../routes/predict-route.js');
const cakeRoutes = require('../routes/cake-route.js');
const umkmRoutes = require('../routes/umkm-route.js');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      payload: {
        maxBytes: 5242880,
        parse: true,
        output: 'data',
        multipart: true,
      }
    }
  });

  server.route(predictRoutes);
  server.route(cakeRoutes);
  server.route(umkmRoutes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
