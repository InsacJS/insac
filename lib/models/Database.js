'use strict'
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const async = require('async')
/** @ignore */ const Config = require('./Config')

/**
* Se encarga de controlar la base de datos.
*/
class Database {

  /**
  * Crea una instancia de la clase Database.
  * @param {Object} [config] - Opciones de configuración del servidor de base de datos.
  * @param {String} [config.name='insac_app'] - Nombre de la base de datos.
  * @param {String} [config.username='postgres'] - Nombre del usuario.
  * @param {String} [config.password='postgres'] - Contraseña del usuario.
  * @param {String} [config.dialect='postgres'] - Gestor de base de datos (postgres ó mysql).
  * @param {String} [config.host='localhost'] - Nombre del servidor de base de datos.
  * @param {Number} [config.port=5432] - Puerto sobre el que se ejecuta el servicio de base de datos.
  */
  constructor(config = Config.defaultDatabase()) {
    let name = config.name || 'insac_app'
    let username = config.username || 'postgres'
    let password = config.password || 'postgres'
    let options = {
      dialect: config.dialect || 'postgres',
      host: config.host || 'localhost',
      port: config.port || 5432,
      logging: false
    }
    /**
    * Instancia de la clase async
    * @type {Sequelize}
    * @see http://docs.sequelizejs.com/
    */
    this.sequelize = new Sequelize(name, username, password, options)

    /**
    * Lista de todos los modelos de sequelze para realizar consultas.
    * @type {SequelizeModel[]}
    */
    this.models = []
  }

  /**
  * Adiciona un modelo
  * @param {SequelizeModel} model Modelo sequelize
  */
  addModel(model) {
    this.models[model.name] = model
  }

  /**
  * Crea las tablas de la base de datos.
  * @param {Model[]} models Modelos de la aplicación.
  * @return {Promise}
  */
  migrate(models) {
    console.log("Iniciando migración ...")
    let seq = this.sequelize

    let migratePromise = new Promise((resolve, reject) => {
      let options = {cascade:true}
      let queryInterface = seq.queryInterface

      seq.drop(options).done(result => {
        console.log("\n · Todas las tablas han sido eliminadas\n")
        let asyncFunctions = []

        for (let i in models) {
          let model = models[i]

          let define = model.sequelize()
          let tableName = define.name, attributes = define.attributes, options = define.options
          /*if (model.options.timestamps) {
            attributes[model.options.createdAt] = {type: Sequelize.DATE}
            attributes[model.options.updatedAt] = {type: Sequelize.DATE}
          }*/
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
          resolve()
        })

      })

    })

    return migratePromise
  }


}

module.exports = Database
