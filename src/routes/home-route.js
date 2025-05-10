const HomeHandler = require('../handlers/home-handler.js');

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: HomeHandler.home
    }
];

module.exports = routes;
