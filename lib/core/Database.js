'use strict'
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const async = require('async')
/** @ignore */ const Config = require('./Config')
/** @ignore */ const Reference = require('../fields/Reference')

/**
* Se encarga de controlar la base de datos.
*/
class Database {

  /**
  * Crea una instancia de la clase Database.
  * @param {Config} config Objeto que contiene todas las configuraciones.
  */
  constructor(config) {

    config = config || new Config()
    let name = config.database.name || 'insac_app'
    let username = config.database.username || 'postgres'
    let password = config.database.password || 'postgres'
    let options = {
      dialect: config.database.dialect || 'postgres',
      host: config.database.host || 'localhost',
      port: config.database.port || 5432,
      logging: false
    }

    /**
    * Instancia de la clase Sequelize.
    * @type {Sequelize}
    * @see http://docs.sequelizejs.com/
    */
    this.sequelize = new Sequelize(name, username, password, options)

    /**
    * Colección de modelos sequelize.
    * @type {SequelizeModel[]}
    */
    this.sequelizeModels = []
  }

  /**
  * Devuelve un objeto con todos los modelos sequelize, una instancia y una
  * referencia a la clase Sequelize
  * @return {Object}
  */
  db() {
    let db = this.sequelizeModels
    db.sequelize = this.sequelize
    db.Sequelize = Sequelize
    return db
  }

  /**
  * Adiciona un modelo.
  * @param {SequelizeModel} sequelizeModel Modelo sequelize
  */
  addModel(sequelizeModel) {
    this.sequelizeModels[sequelizeModel.name] = sequelizeModel
  }

  /**
  * Asocia todos los modelos de sequelize de acuerdo a su tipo de relación.
  * @param {Model} model Modelo a partir del que se actualizarán el resto de modelos.
  */
  updateModels(model) {
    let nameA = model.name, singular = model.options.singular, plural = model.options.plural
    for (let prop in model.fields) {
      let field = model.fields[prop]
      if (field instanceof Reference) {
        let nameB = field.reference.model
        switch (field.reference.type) {
          case '1:1':
            this.sequelizeModels[nameA].belongsTo(this.sequelizeModels[nameB], {as:this.sequelizeModels[nameB].options.singular, foreignKey: prop})
            this.sequelizeModels[nameB].hasOne(this.sequelizeModels[nameA], {as:singular, foreignKey: prop})
            break
          case '1:N':
            this.sequelizeModels[nameA].belongsTo(this.sequelizeModels[nameB], {as:this.sequelizeModels[nameB].options.singular, foreignKey: prop})
            this.sequelizeModels[nameB].hasMany(this.sequelizeModels[nameA], {as:plural, foreignKey: prop})
            break
          default:
            let msg = `No se reconoce el tipo de referencia '${field.reference.type}' del modelo '${model.name}'`
            throw new Error(msg)
        }
      }
    }
  }

  /**
  * Devuelve una promesa que crea las tablas en la base de datos.
  * @param {Model[]} models Colección de modelos.
  * @return {Promise}
  */
  migrate(models) {
    console.log(`\n Iniciando migración ...`)
    let seq = this.sequelize
    let migratePromise = new Promise((resolve, reject) => {
      let options = {cascade:true}
      let queryInterface = seq.queryInterface
      seq.drop(options).done(result => {
        console.log(`\n\x1b[2m - Todas las tablas han sido eliminadas\n\x1b[0m`)
        let asyncFunctions = []
        for (let i in models) {
          let model = models[i]
          let define = model.sequelize()
          let tableName = define.name, attributes = define.attributes, options = define.options
          asyncFunctions.push(function(callback) {
            queryInterface.createTable(tableName, attributes, options).done(result => {
              console.log(`\x1b[2m - Se creó la tabla '${tableName}'\x1b[0m`)
              callback(null)
            })
          })
        }
        async.waterfall(asyncFunctions, function(err, result) {
          if (err) {
            reject(new Error(err))
          }
          console.log(`\x1b[32m\n Migración finalizada exitosamente\x1b[0m \u2713\n`)
          resolve()
        })
      })
    })
    return migratePromise
  }

}

module.exports = Database
