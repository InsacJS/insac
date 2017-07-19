'user strict'
var Config = require('../Config');
var Sequelize = require('sequelize');
var DatabaseConfig = require('./DatabaseConfig');

class Database {

  constructor() {
    this.sequelize = null;
    this.seqModels = [];
  }

  update() {
    this.sequelize = new Sequelize(Config.database.dbname, Config.database.username, Config.database.password, {
      dialect: Config.database.dialect,
      timeZone: Config.database.timeZone,
      host: Config.database.host,
      port: Config.database.port,
      logging: false
    });
  }

  migrate(models, modelsName) {
    this.init(models);
    for (let i in models) {
      let model = models[i];

      if (!contains(modelsName, model.name)) {
        continue;
      }

      let tableName = model.name;
      let attributes = {};
      let options = {};

      attributes[model.id.name] = {
        type: model.id.type,
        allowNull: model.id.allowNull,
        primaryKey: true,
        autoIncrement: true
      }

      for (let j in model.fields) {
        let field = model.fields[j];
        attributes[field.name] = {
          type: field.type,
          allowNull: field.allowNull,
          unique: field.unique
        };
      }

      if (model.options.timeStamps) {
        attributes[model.createdAt.name] = {
          type: model.createdAt.type
        };
        attributes[model.updatedAt.name] = {
          type: model.updatedAt.type
        };
      }

      if (model.options.idUserStamps) {
        attributes[model.idUserCreated.name] = {
          type: model.idUserCreated.type
        };
        attributes[model.idUserUpdated.name] = {
          type: model.idUserUpdated.type
        };
      }
      let queryInterface = this.sequelize.queryInterface;
      queryInterface.dropTable(tableName).done(function() {
        queryInterface.createTable(tableName, attributes, options).done(function() {
          console.log(` - Tabla ${tableName} creada exitosamente`);
        });
      });
    }
  }

  init(models) {
    for (let i in models) {
      let model = models[i];
      this.seqModels[model.name] = createSequelizeModel(model, this.sequelize);
    }
    Object.keys(this.seqModels).forEach(key => {
      if(this.seqModels[key].associate) {
        this.seqModels[key].associate(this.seqModels);
      }
    });
  }

}

module.exports = Database;
module.exports.DataType = Sequelize.DataTypes;

function contains(list, str) {
  for (let i in list) {
    if (list[i] == str) {
      return true;
    }
  }
  return false;
}

function createSequelizeModel(model, sequelize) {
  let id = model.id.name;
  let modelName = model.name;
  let attributes = {};
  let options = {};
  attributes[model.id.name] = getIdAttribute(model.id);
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

function getIdAttribute(field) {
  let attribute = {
    type: field.type,
    allowNull: field.allowNull,
    primaryKey: true,
    autoIncrement: true
  };
  return attribute;
}

function getAttribute(field) {
  let attribute = {
    type: field.type,
    allowNull: field.allowNull,
    unique: field.unique,
    validate: getValidate(field.validators)
  };
  return attribute;
}

/*function getDataType(type) {
  let dataType;
  switch (type) {
    case 'INTEGER': dataType = Sequelize.INTEGER; break;
    case 'STRING': dataType = Sequelize.STRING; break;
    case 'DATE': dataType = Sequelize.DATETIME; break;
  }
  return dataType;
}*/

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
