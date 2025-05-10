'use strict';

const Hapi = require('@hapi/hapi');
const homeRoutes = require('../routes/home-route.js');
const kueRoutes = require('../routes/kue-route.js');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: true
        }
    });

    server.route([
        ...homeRoutes,
        ...kueRoutes
    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
