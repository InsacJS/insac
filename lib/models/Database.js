'user strict'
var Sequelize = require('sequelize');
var DatabaseConfig = require('./DatabaseConfig');

class Database {

  constructor() {
    this.config = null;
    this.sequelize = null;
    this.seqModels = [];
  }

  setConfig(config) {
    this.config = config;
    this.sequelize = new Sequelize(this.config.dbname, this.config.username, this.config.password, this.config.getParams());
  }

}

module.exports Database;
