'use strict'
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const async = require('async')
/** @ignore */ const Config = require('./Config')
/** @ignore */ const Reference = require('../fields/Reference')
/** @ignore */ const Util = require('../utils/Util')

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
      logging: false,
      operatorsAliases: false
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
  * referencia a la clase Sequelize.
  * @return {Object}
  */
  db() {
    let db = {}
    for (let modelName in this.sequelizeModels) {
      db[modelName] = this.sequelizeModels[modelName]
    }
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
  * También actualiza las asociaciones de los modelos involucrados.
  * @param {Model} model Modelo a partir del que se actualizarán el resto de modelos.
  * @param {Model[]} models Colección de modelos.
  */
  updateModels(model, models) {
    let nameA = model.name
    for (let prop in model.fields) {
      let field = model.fields[prop]
      if (field instanceof Reference) {
        // REFERENCIAS
        let nameB = field.reference.model,
          referenceAs = field.reference.as,
          foreignKey = field.reference.foreignKey,
          targetKey = field.reference.key,
          allowNull = !field.required
        // // Valida que no existan referencias duplicadas.
        // for (let i in models[nameA].fields) {
        //   let fie = models[nameA].fields[i]
        //   if (fie.reference && (fie.reference.model == nameA) && (referenceAs === fie.reference.as)) {
        //     let msg = `Ya existe una referencia con el campo '${referenceAs}' establecida sobre el modelo '${nameA}'`
        //     throw new Error(msg)
        //   }
        // }
        // Ejemplo: rol_usuario.belongsTo(rol, { as:'rol', foreignKey: { name:'id_rol', targetKey:'id' } })
        this.sequelizeModels[nameA].belongsTo(this.sequelizeModels[nameB], {
          as: referenceAs,
          foreignKey: { name:foreignKey, targetKey:targetKey, allowNull:allowNull }
        })
        // ASOCIACIONES
        if (field.association) {
          // // Valida que no existan asociaciones duplicadas.
          // for (let i in models[nameB].options.associations) {
          //   let assoc = models[nameB].options.associations[i]
          //   if (assoc.model === nameB && assoc.as === field.association.as) {
          //     let msg = `Ya existe una asociación con el campo '${assoc.as}' establecida sobre el modelo '${nameB}', desde el modelo '${nameA}'`
          //     throw new Error(msg)
          //   }
          // }
          // Actualizamos las asociaciones del modelo al que se hace referencia.
          models[nameB].options.associations.push(field.association)
          let type = field.association.type, associationAs = field.association.as
          let typeAssoc = (type == '1:1') ? 'hasOne' : 'hasMany'
          // Ejemplo: rol.hasMany(rol_usuario, { as:'roles_usuarios', foreignKey: { name:'id_rol' } })
          this.sequelizeModels[nameB][typeAssoc](this.sequelizeModels[nameA], {
            as: associationAs,
            foreignKey: { name:foreignKey }
          })
        }
      }
    }
  }

  /**
  * Devuelve una promesa que crea las tablas en la base de datos. En caso de no especificar la ruta,
  * se crearán todas las tablas.
  * @param {Model[]} models Colección de modelos.
  * @param {String} [path] Subdirectorio de la carpeta models. Sólo se crearán
  * las tablas que se encuentren dentro de esta carpeta.
  * @return {Promise}
  */
  migrate(models, path) {
    console.log(`\n Iniciando migración ...\n`)
    let seq = this.sequelize
    let migratePromise = new Promise((resolve, reject) => {
      let queryInterface = seq.queryInterface
      let asyncFunctions = []
      // Se eliminan las tablas, a partir del último modelo.
      let keys = new Array()
      for (let k in models) {
        keys.unshift(k)
      }
      for (let c = keys.length, n = 0; n < c; n++) {
        let model = models[keys[n]]
        let modelFile = path ? Util.getContentFiles(path, {fileName:model.name, recursive:false}) : [{}]
        if (Object.keys(modelFile).length > 0) {
          // Significa que existe el modelo en la ruta especificada,
          // por lo tanto, se puede eliminar esta tabla
          asyncFunctions.push(function(callback) {
            queryInterface.dropTable(model.name, {cascade:true}).done(() => {
              console.log(`\x1b[2m - Se eliminó la tabla '${model.name}'\x1b[0m`)
              callback(null)
            })
          })
        }
      }
      // Se crean las tablas en el orden con el que fueron adicionadass.
      for (let i in models) {
        let model = models[i]
        let modelFile = path ? Util.getContentFiles(path, {fileName:model.name, recursive:false}) : [{}]
        if (Object.keys(modelFile).length <= 0) {
          // Significa que no existe el modelo en la ruta especificada,
          // por lo que no se realizará ninguna acción sobre esta tabla
          continue
        }
        let define = model.sequelize()
        let tableName = define.name, attributes = define.attributes, options = define.options
        asyncFunctions.push(function(callback) {
          queryInterface.createTable(tableName, attributes, options).done(() => {
            console.log(`\x1b[2m - Se creó la tabla '${tableName}'\x1b[0m`)
            callback(null)
          })
        })
      }
      async.waterfall(asyncFunctions, function(err) {
        if (err) {
          return reject(new Error(err))
        }
        console.log(`\x1b[32m\n Migración finalizada exitosamente\x1b[0m \u2713\n`)
        resolve()
      })
    })
    return migratePromise
  }
}

module.exports = Database
