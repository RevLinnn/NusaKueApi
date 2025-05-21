const { getAllUmkm, getUmkmById } = require('../handlers/umkm-handler.js');

const routes = [
  {
    method: 'GET',
    path: '/umkms',
    handler: getAllUmkm
  },
  {
    method: 'GET',
    path: '/umkms/{id}',
    handler: getUmkmById
  }
];

module.exports = routes;
