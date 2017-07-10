var Sequelize = require('sequelize');

class Database {

  constructor(models) {
    // Atributos
    this.models;
    this.db;

    // Valores por defecto
    this.models = models;
    this.init();
  }

  init() {
    if (this.db) {
      return;
    }
    let config = {database:'insac', username:'postgres', password:'BK8DJ567F0', params:{
      dialect: "postgres", port: 5432, host: "localhost", logging: false}
    };
    let sequelize = new Sequelize(config.database, config.username, config.password, config.params);
    let db = {sequelize, Sequelize, models: {}};

    for (let i in this.models) {
      let model = this.models[i];
      let modelSequelize = this.createModelSequelize(model, sequelize);
      db.models[modelSequelize.name] = modelSequelize;
    }

    Object.keys(db.models).forEach(key => {
      if(db.models[key].associate) {
        db.models[key].associate(db.models);
      }
    });
    this.db = db;
  }

  createModelSequelize(model, sequelize) {
    let id = model.id;
    let modelName = model.name;
    let attributes = {};
    let options = {};
    attributes[id] = {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    };
    for (let i in model.fields) {
      let field = model.fields[i];
      attributes[field.name] = {
        type: Sequelize.STRING
      }
    }
    options['createdAt'] = '_fecha_creacion';
    options['updatedAt'] = '_fecha_modificacion';
    options['freezeTableName'] = true;
    return sequelize.define(modelName, attributes, options);
  }

  migrate() {
    console.log("- Migrate started");
    for (let i in this.models) {
      let model = this.models[i];

      let tableName = model.name;
      let attributes = {};
      let options = {};

      attributes[model.id] = {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      }

      for (let j in model.fields) {
        let field = model.fields[j];
        attributes[field.name] = {
          type: Sequelize.STRING
        };
      }

      attributes['_fecha_creacion'] = {
        type: Sequelize.DATE
      }

      attributes['_fecha_modificacion'] = {
        type: Sequelize.DATE
      }

      this.db.sequelize.queryInterface.dropTable(tableName);
      this.db.sequelize.queryInterface.createTable(tableName, attributes, options);
    }
    console.log("- Migrate finish");
  }
}

module.exports = Database;
