'user strict'
const Config = require('../config/Config')
const async = require('async')
const Sequelize = require('sequelize')
const DataType = require('./DataType')
const Reference = require('./Reference')

class Database {

  constructor() {
    this.seqModels = []
    this.sequelize = new Sequelize(Config.database.dbname, Config.database.username, Config.database.password, {
      dialect: Config.database.dialect,
      timeZone: Config.database.timeZone,
      host: Config.database.host,
      port: Config.database.port,
      logging: false
    })
  }

  migrate(models) {
    console.log(`Iniciando migración ...`)
    let seq = this.sequelize

    this.init(models)

    let migratePromise = new Promise((resolve, reject) => {
      let options = {cascade:true}
      let queryInterface = seq.queryInterface

      seq.drop(options).done(result => {
        console.log(`\n - Todas las tablas han sido eliminadas`)
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
          if (typeof model.options.uniqueKeys != 'undefined') {
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
          console.log(`\nMigración finalizada\n`)
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
            case Reference.ONE_TO_ONE_VALUE:
              this.seqModels[field.reference.model].hasOne(this.seqModels[model.name], {as:model.options.singular, foreignKey: field.name})
              models[field.reference.model].options.associations.push({model:model.name, as:model.options.singular})
              this.seqModels[model.name].belongsTo(this.seqModels[field.reference.model], {as:models[field.reference.model].options.singular, foreignKey: field.name})
              break
            case Reference.ONE_TO_MANY_VALUE:
              this.seqModels[field.reference.model].hasMany(this.seqModels[model.name], {as:model.options.plural, foreignKey: field.name})
              models[field.reference.model].options.associations.push({model:model.name, as:model.options.plural})
              this.seqModels[model.name].belongsTo(this.seqModels[field.reference.model], {as:models[field.reference.model].options.singular, foreignKey: field.name})
              break
            default:
              throw new Error('Tipo de referencia no soportado')
          }
        }
      }
      // Incorcoración del modelo sequelize dentro del modelo
      model.seq = this.seqModels[model.name]
    }
  }

}

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
  options['singular'] = model.options.singular
  options['plural'] = model.options.plural

  return sequelize.define(modelName, attributes, options)
}

function createSequelizeAttribute(field) {
  let attribute = {
    type: createSequelizeType(field.type)
  }
  if (typeof field.allowNull != 'undefined') {
    attribute.allowNull = field.allowNull
  }
  if (typeof field.primaryKey != 'undefined') {
    attribute.primaryKey = field.primaryKey
  }
  if (typeof field.autoIncrement != 'undefined') {
    attribute.autoIncrement = field.autoIncrement
  }
  if (typeof field.reference != 'undefined') {
    attribute.references = {
      model: field.reference.model
    }
    if (typeof field.reference.key != 'undefined') {
      attribute.references.key = field.reference.key
    }
  }
  if (typeof field.defaultValue != 'undefined') {
    attribute.defaultValue = field.defaultValue
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
}
