'user strict'
var express = require('express');
var ServerConfig = require('./ServerConfig');

class Server {

  constructor() {
    this.server = express();
    this.config = null;
  }

  setConfig(config) {
    this.config = config;
  }

}

module.exports = Server;
