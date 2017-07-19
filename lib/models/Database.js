'user strict'
const Config = require('../Config');
const Sequelize = require('sequelize');
const f = require('../utils/functions');

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
    let queryInterface = this.sequelize.queryInterface;
    this.sequelize.drop().done(function(a) {
      for (let i in models) {
        let model = models[i];

        if (!f.contains(modelsName, model.name)) {
          continue;
        }

        let tableName = model.name;
        let attributes = {};
        let options = {};

        attributes[model.id.name] = {
          type: model.id.type,
          allowNull: model.id.allowNull,
          primaryKey: model.id.primaryKey,
          unique: model.id.unique,
          autoIncrement: true
        }

        for (let j in model.fields) {
          let field = model.fields[j];
          attributes[field.name] = {
            type: field.type,
            allowNull: field.allowNull,
            primaryKey: field.primaryKey,
            unique: field.unique
          };
          if (typeof field.reference !== 'undefined') {
            attributes[field.name].references = {model: field.reference, key: model.id.name};
          }
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

        queryInterface.createTable(tableName, attributes, options).done(function(c) {
          console.log(` - Tabla '${tableName}' creada exitosamente`);
        });

      }
    });

  }

  init(models) {
    // Creación de los modelos de sequelize
    for (let i in models) {
      let model = models[i];
      this.seqModels[model.name] = createSequelizeModel(model, this.sequelize);
    }
    // Asociación de los modelos de sequelize
    for (let i in models) {
      let model = models[i];
      for (let j in model.fields) {
        let field = model.fields[j];
        if (typeof field.reference !== 'undefined') {
          this.seqModels[field.reference].hasMany(this.seqModels[model.name], {as: model.name, foreignKey: model.id.name});
          this.seqModels[model.name].belongsTo(this.seqModels[field.reference], {as: field.reference, foreignKey: field.name});
          break;
        }
      }
    }
  }

}

module.exports = Database;
module.exports.DataType = Sequelize.DataTypes;

function createSequelizeModel(model, sequelize) {
  let id = model.id.name;
  let modelName = model.name;
  let attributes = {};
  let options = {};
  attributes[model.id.name] = getIdAttribute(model.id);
  for (let i in model.fields) {
    attributes[model.fields[i].name] = getAttribute(model.fields[i]);
    if (typeof model.fields[i].reference !== 'undefined') {
      attributes[model.fields[i].name].references = {model: model.fields[i].reference, key: model.id.name};
    }
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
