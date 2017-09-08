'use strict'
/** @ignore */ const Reference = require('./Reference')
/** @ignore */ const async = require('async')

/**
* Funciones que permiten crear datos directamente en la base de datos.
*/
class Seeder {

  /**
  * Crea una instancia de la clase Seeder
  * @param {Model[]} models Modelos de la aplicación.
  * @param {Database} db Instancia de la base de datos de la aplicación.
  */
  constructor(models, db) {
    /**
    * Modelos de la aplicación
    * @type {Model[]}
    */
    this.models = models

    /**
    * Base de datos de la aplicación.
    * @type {Object}
    */
    this.db = db
  }

  /**
  * Crea datos de un determinado modelo.
  * @param {String} modelName Nombre del modelo.
  * @param {Object[]} dataArray Lista de registros.
  * @return {Function} Devuelve una función callback.
  */
  create(modelName, dataArray) {
    return (callback) => {
      console.log(` - Procesando seed '${modelName}'`)
      let tasks = []
      for (let i in dataArray) {
        let data = dataArray[i]
        let container = {}
        container[modelName] = {}
        let level = 1
        let task = this._createSubmodelTask(this.models[modelName], data, container, modelName, level)
        tasks.push(task)
      }
      async.waterfall(tasks, (err, result) => {
        if (err) {
          return callback(err)
        } else {
          callback(null)
        }
      })
    }
  }

  /** @ignore */
  _createSubmodelTask(model, data, container, fieldName, level) {
    let modelName = model.name
    let modelData = {}

    let asyncFunctions = []
    for (let prop in model.fields) {
      let field = model.fields[prop]
      if ((field instanceof Reference) && !data[prop]) {
        let modelReference = field.reference.model
        container[fieldName][modelReference] = {}
        asyncFunctions.push(this._createSubmodelTask(this.models[modelReference], data[modelReference], container[fieldName], modelReference, level + 1))
      } else {
        if (prop == 'id' && !data['id']) {
          continue
        }
        modelData[prop] = data[prop]
      }
    }
    if (asyncFunctions.length > 0) {
      return (callback) => {
        async.waterfall(asyncFunctions, (err, result) => {
          if (err) {
            callback(err)
          } else {
            modelData = {}
            for (let prop in model.fields) {
              let field = model.fields[prop]
              if ((field instanceof Reference) && !data[prop]) {
                modelData[prop] = container[fieldName][field.reference.model].id
              } else {
                if (prop == 'id' && !data['id']) {
                  continue
                }
                modelData[prop] = data[prop]
              }
            }
            this.db[modelName].create(modelData).then(result => {
              container[fieldName].id = result.id
              this.db.sequelize.query(`ALTER SEQUENCE ${modelName}_id_seq RESTART WITH ${result.id + 1}`).then(result => {
                callback(null)
              })
            }).catch(err => {
              callback(err)
            })
          }
        })
      }

    } else {
      return (callback) => {
        this.db[modelName].create(modelData).then(result => {
          container[fieldName].id = result.id
          this.db.sequelize.query(`ALTER SEQUENCE ${modelName}_id_seq RESTART WITH ${result.id + 1}`).then(result => {
            callback(null)
          })
        }).catch(err => {
          callback(err)
        })
      }
    }

  }

}

module.exports = Seeder
