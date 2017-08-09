'user strict'
<<<<<<< HEAD
const Config = require('../config/Config')
const async = require('async')
const Sequelize = require('sequelize')
const DataType = require('./DataType')
const Reference = require('./Reference')
=======
const Config = require('../Config');
const Sequelize = require('sequelize');
const f = require('../utils/functions');
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7

class Database {

  constructor() {
<<<<<<< HEAD
    this.seqModels = []
=======
    this.sequelize = null;
    this.seqModels = [];
  }

  update() {
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7
    this.sequelize = new Sequelize(Config.database.dbname, Config.database.username, Config.database.password, {
      dialect: Config.database.dialect,
      timeZone: Config.database.timeZone,
      host: Config.database.host,
      port: Config.database.port,
      logging: false
<<<<<<< HEAD
    })
  }

  migrate(models) {
    console.log("Iniciando migración ...")
    let seq = this.sequelize

    this.init(models)

    let migratePromise = new Promise((resolve, reject) => {
      let options = {cascade:true}
      let queryInterface = seq.queryInterface

      seq.drop(options).done(result => {
        console.log("\n · Todas las tablas han sido eliminadas\n")
        let asyncFunctions = []

        for (let i in models) {
          let model = models[i]

          let tableName = model.name, attributes = {}, options = {}

          // Atributos
          for (let j in model.fields) {
            attributes[model.fields[j].name] = createSequelizeAttribute(model.fields[j])
          }

          // Atributos timestamp
          if (model.options.timestamps) {
            attributes[model.options.createdAt] = {type: Sequelize.DATE}
            attributes[model.options.updatedAt] = {type: Sequelize.DATE}
          }
          // Opciones
          if (typeof model.options.uniqueKeys !== 'undefined') {
            options['uniqueKeys'] = model.options.uniqueKeys
          }

          asyncFunctions.push(function(callback) {
            queryInterface.createTable(tableName, attributes, options).done(result => {
              console.log(` - Se creó la tabla '${tableName}'`)
              callback(null)
            })
          })
        }

        async.waterfall(asyncFunctions, function(err, result) {
          if (err) {
            reject(new Error(err))
          }
          let msg = "Migración finalizada"
          console.log(`\n · ${msg}\n`)
          resolve('OK')
        })

      })

    })

    return migratePromise
  }

  init(models) {
    this.seqModels = []
    // Creación de modelos sequelize
    for (let i in models) {
      let model = models[i]
      this.seqModels[model.name] = createSequelizeModel(model, this.sequelize)
    }
    // Asociación de modelos sequelize
    for (let i in models) {
      let model = models[i]
      for (let j in model.fields) {
        let field = model.fields[j]
        if (typeof field.reference != 'undefined') {
          switch (field.reference.type) {
            case Reference.ONE_TO_ONE:
              this.seqModels[field.reference.model].hasOne(this.seqModels[model.name], {as: model.name, foreignKey: model.fields.id.name})
              this.seqModels[model.name].belongsTo(this.seqModels[field.reference.model], {as: field.reference.model, foreignKey: field.name})
              break
            case Reference.ONE_TO_MANY:
              this.seqModels[field.reference.model].hasMany(this.seqModels[model.name], {as: model.name, foreignKey: model.fields.id.name})
              this.seqModels[model.name].belongsTo(this.seqModels[field.reference.model], {as: field.reference.model, foreignKey: field.name})
              break
            default:
              throw new Error('Tipo de referencia no soportado')
          }
        }
      }
      // Incorcoración del modelo sequelize dentro del modelo
      model.seq = this.seqModels[model.name]
=======
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
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7
    }
  }

}

<<<<<<< HEAD
module.exports = Database

function createSequelizeModel(model, sequelize) {
  let modelName = model.name, attributes = {}, options = {}

  // Atributos
  for (let i in model.fields) {
    attributes[model.fields[i].name] = createSequelizeAttribute(model.fields[i])
  }

  // Opciones
  options['freezeTableName'] = model.options.freezeTableName
  options['timestamps'] = model.options.timestamps
  options['createdAt'] = model.options.createdAt
  options['updatedAt'] = model.options.updatedAt

  return sequelize.define(modelName, attributes, options)
}

function createSequelizeAttribute(field) {
  let attribute = {
    type: createSequelizeType(field.type)
  }
  if (typeof field.allowNull !== 'undefined') {
    attribute.allowNull = field.allowNull
  }
  if (typeof field.primaryKey !== 'undefined') {
    attribute.primaryKey = field.primaryKey
  }
  if (typeof field.autoIncrement !== 'undefined') {
    attribute.autoIncrement = field.autoIncrement
  }
  if (typeof field.reference !== 'undefined') {
    attribute.references = {
      model: field.reference.model
    }
    if (typeof field.reference.key !== 'undefined') {
      attribute.references.key = field.reference.key
    }
  }
  return attribute
}

function createSequelizeType(type) {
  switch (type.name) {
    case DataType.STRING_NAME:
      return Sequelize.STRING(type.args[0])
    case DataType.INTEGER_NAME:
      return Sequelize.INTEGER
    default:
      throw new Error(`Tipo de dato no soportado: ${type.name}`)
  }
=======
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
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7
}
