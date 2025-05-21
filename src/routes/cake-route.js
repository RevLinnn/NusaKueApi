const { getAllKue, getCakeById } = require('../handlers/cake-handler.js');

const routes = [
  {
    method: 'GET',
    path: '/cakes',
    handler: getAllKue
  },
  {
    method: 'GET',
    path: '/cakes/{id}',
    handler: getCakeById
  }
];

module.exports = routes;
