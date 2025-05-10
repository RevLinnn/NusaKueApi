const KueHandler = require("../handlers/kue-handler");

const routes = [
  {
    method: "POST",
    path: "/kue",
    handler: KueHandler.addKue,
  },
  {
    method: 'GET',
    path: '/kue',
    handler: KueHandler.getAllKue
  }
];

module.exports = routes;
