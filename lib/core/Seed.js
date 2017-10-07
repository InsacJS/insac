'use strict'
/** @ignore */ const Reference = require('../fields/Reference')
/** @ignore */ const async = require('async')

/**
* Clase que permite crear seeders
*/
class Seed {

  /**
  * Crea una instancia de la clase Seed
  * @param {!String} name Nombre del modelo.
  * @param {!Object[]} data Lista de registros.
  */
  constructor(name, data) {

    /**
    * Nombre del modelo.
    * @type {String}
    */
    this.name = name

    /**
    * Lista de registros.
    * @type {Object[]}
    */
    this.data = data
  }

  /**
  * Devuelve una función de tipo callback que crea los datos de este seed.
  * @param {Model[]} models Colección de modelos.
  * @param {Object} db Objeto que contiene modelos sequelize, una instancia y
  * una referencia hacia la clase Sequelize.
  * @return {Function} Functión de tipo callback (callback) => { callback(null) }
  */
  getCallback(models, db) {
    let modelName = this.name
    return (callback) => {
      console.log(`\x1b[2m - Procesando seed '${modelName}'\x1b[0m`)
      let tasks = []
      for (let i in this.data) {
        let data = this.data[i]
        let container = {}
        container[modelName] = {}
        let level = 1
        let task = this._createSubmodelTask(models[modelName], data, container, modelName, level, models, db)
        tasks.push(task)
      }
      async.waterfall(tasks, (err) => {
        if (err) {
          return callback(err)
        } else {
          callback(null)
        }
      })
    }
  }

  /** @ignore */
  _createSubmodelTask(model, data, container, fieldName, level, models, db) {
    let modelName = model.name
    let modelData = {}
    let asyncFunctions = []
    for (let prop in model.fields) {
      let field = model.fields[prop]
      if ((field instanceof Reference) && !data[prop]) {
        let modelReference = field.reference.model
        container[fieldName][modelReference] = {}
        let task = this._createSubmodelTask(models[modelReference], data[modelReference], container[fieldName], modelReference, level + 1, models, db)
        asyncFunctions.push(task)
      } else {
        if (prop == 'id' && !data['id']) {
          continue
        }
        modelData[prop] = data[prop]
      }
    }
    if (asyncFunctions.length > 0) {
      return (callback) => {
        async.waterfall(asyncFunctions, (err) => {
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
            db[modelName].create(modelData).then(result => {
              container[fieldName].id = result.id
              db.sequelize.query(`ALTER SEQUENCE ${modelName}_id_seq RESTART WITH ${result.id + 1}`).then(() => {
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
        db[modelName].create(modelData).then(result => {
          container[fieldName].id = result.id
          db.sequelize.query(`ALTER SEQUENCE ${modelName}_id_seq RESTART WITH ${result.id + 1}`).then(() => {
            callback(null)
          })
        }).catch(err => {
          callback(err)
        })
      }
    }
  }

}

module.exports = Seed
