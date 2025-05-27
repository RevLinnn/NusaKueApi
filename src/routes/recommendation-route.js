const { getRecomendedUmkm} = require('../handlers/recommendation-handler.js');

const routes = [
    {
        method: 'GET',
        path: '/recommendation/{id}',
        handler: getRecomendedUmkm
    }
];

module.exports = routes;