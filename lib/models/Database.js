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

  migrate(models) {
    this.init(models);
    console.log(" - Creando tablas ...");
    for (let i in models) {
      let model = models[i];

      let tableName = model.name;
      let attributes = {};
      let options = {};

      attributes[model.id.name] = {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      }

      for (let j in model.fields) {
        let field = model.fields[j];
        attributes[field.name] = {
          type: getDataType(field.type),
          allowNull: field.allowNull,
          unique: field.unique
        };
      }

      if (model.options.timeStamps) {
        attributes[model.createdAt.name] = {
          type: Sequelize.DATE
        };
        attributes[model.updatedAt.name] = {
          type: Sequelize.DATE
        };
      }

      if (model.options.idUserStamps) {
        attributes[model.idUserCreated.name] = {
          type: Sequelize.INTEGER
        };
        attributes[model.idUserUpdated.name] = {
          type: Sequelize.INTEGER
        };
      }
      let queryInterface = this.sequelize.queryInterface;
      queryInterface.dropTable(tableName).done(function() {
        queryInterface.createTable(tableName, attributes, options);
      });
    }
    console.log(" - Tablas creadas exitosamente");
  }

  init(models) {
    for (let i in models) {
      let model = models[i];
      this.seqModels[model.name] = createModelSequelize(model, this.sequelize);
    }
    Object.keys(this.seqModels).forEach(key => {
      if(this.seqModels[key].associate) {
        this.seqModels[key].associate(this.seqModels);
      }
    });
  }

}

module.exports = Database;

function createModelSequelize(model, sequelize) {
  let id = model.id.name;
  let modelName = model.name;
  let attributes = {};
  let options = {};
  attributes[model.id.name] = getAttributeID(model.id);
  for (let i in model.fields) {
    attributes[model.fields[i].name] = getAttribute(model.fields[i]);
  }
  if (model.options.idUserStamps) {
    attributes[model.idUserCreated.name] = getAttribute(model.idUserCreated);
    attributes[model.idUserUpdated.name] = getAttribute(model.idUserUpdated);
  }
  if (model.options.timeStamps) {
    options['createdAt'] = model.createdAt.name;
    options['updatedAt'] = model.updatedAt.name;
  }
  options['freezeTableName'] = true;
  return sequelize.define(modelName, attributes, options);
}

function getAttributeID(field) {
  let attribute = {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  };
  return attribute;
}

function getAttribute(field) {
  let attribute = {
    type: getDataType(field.type),
    allowNull: field.allowNull,
    unique: field.unique,
    validate: getValidate(field.validators)
  };
  return attribute;
}

function getDataType(type) {
  let dataType;
  switch (type) {
    case 'INTEGER': dataType = Sequelize.INTEGER; break;
    case 'STRING': dataType = Sequelize.STRING; break;
    case 'DATE': dataType = Sequelize.DATETIME; break;
  }
  return dataType;
}

function getValidate(validators) {
  let validate = {};
  for (let i in validators) {
    let validator = validators[i];
    validate[validator.name] = {
      args: validator.args,
      msg: validator.msg
    };
  }
  return validate;
}
