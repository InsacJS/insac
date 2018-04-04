/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const Seed      = require('seed-creator')
/** @ignore */ const util      = require('../tools/util')
/** @ignore */ const Loader    = require('../core/Loader')
/** @ignore */ const config    = require('../config/app.config')

/**
* Módulo encargado de gestionar la base de datos.
*/
class Database {
  /**
  * Crea una instancia de la clase Database.
  * @param {Function} app - Instancia del servidor express.
  */
  constructor (app) {
    const sequelize = new Sequelize(
      config.DATABASE.database,
      config.DATABASE.username,
      config.DATABASE.password,
      config.DATABASE.params
    )
    /**
    * Instancia del servidor express.
    * @type {Function}
    */
    this.app = app
    /**
    * Instancia sequelize.
    * @type {Sequelize}
    */
    this.sequelize = sequelize
    /**
    * Referencia hacia la clase Sequelize
    * @type {Sequelize}
    */
    this.Sequelize = Sequelize
  }

  /**
  * Importa los modelos de un modulo.
  * @param {!String} moduleName                     - Nombre del módulo.
  * @param {Object}  [options]                      - Opciones de instalación.
  * @param {String}  [options.modelsPath]           - Ruta de la carpeta models.
  * @param {String}  [options.modelExt='.model.js'] - Extension del archivo model.
  * @param {String}  [options.daoPath]              - Ruta de la carpeta dao.
  * @param {String}  [options.daoExt='.dao.js']     - Extension del archivo dao.
  * @return {Promise}
  */
  import (moduleName, { modelsPath, modelExt, daoPath, daoExt }) {
    const APP       = this.app
    const MODEL_EXT = modelExt || '.model.js'
    const MODULE    = APP[moduleName]
    MODULE.models   = {}
    util.find(modelsPath, MODEL_EXT, ({ filePath, fileName }) => {
      const MODEL = this.sequelize.import(filePath)
      if (MODEL.options.schema === MODULE.config.schema) MODULE.models[fileName] = MODEL
    })
    Object.keys(MODULE.models).forEach((key) => {
      if ('associate' in MODULE.models[key]) { MODULE.models[key].associate(APP) }
      this._updateForeignKeys(MODULE.models[key])
    })
    if (daoPath) {
      MODULE.dao    = {}
      const DAO_EXT = daoExt || '.dao.js'
      util.find(daoPath, DAO_EXT, ({ filePath, fileName }) => {
        MODULE.dao[fileName] = require(filePath)(APP)
      })
    }
  }

  /**
  * Actualiza las propiedades de las claves foráneas.
  * @param {SequelizeModel} model - Modelo sequelize.
  */
  _updateForeignKeys (model) {
    const APP = this.app
    Object.keys(model.attributes).forEach(fieldName => {
      const FIELD = model.attributes[fieldName]
      if (FIELD.references) {
        const F_KEY    = FIELD.references.key
        const F_MODULE = FIELD.references.model.schema.toUpperCase()
        const F_MODEL  = APP[F_MODULE].models[FIELD.references.model.tableName]
        FIELD.validate = F_MODEL.attributes[F_KEY].validate
        FIELD.comment  = FIELD.comment || F_MODEL.attributes[F_KEY].comment
        FIELD.example  = FIELD.example || F_MODEL.attributes[F_KEY].example
      }
    })
  }

  /**
  * Crea las tablas de la base de datos dentro de un esquema para cada módulo.
  * @param {!String} moduleName                   - Nombre del módulo.
  * @param {Object}  [options]                    - Opciones de instalación.
  * @param {String}  [options.seedersPath]        - Ruta de la carpeta seeders.
  * @param {String}  [options.seedExt='.seed.js'] - Extension del archivo seed.
  * @return {Promise}
  */
  async setup (moduleName, options = {}) {
    const APP             = this.app
    const MODULE          = APP[moduleName]
    const SCHEMA          = MODULE.config.schema
    const ALLOWED_SCHEMAS = [] // Esquemas que pueden ser instalados
    APP.MODULES.forEach(modName => { if (APP[modName].config.setup) { ALLOWED_SCHEMAS.push(APP[modName].config.schema) } })
    if (!ALLOWED_SCHEMAS.includes(SCHEMA)) {
      return APP.log(`\x1b[2m - [Instalación Deshabilitada]\x1b[0m\n\n`)
    }
    await this._setupModels(MODULE)
    if (options.seedersPath) {
      await this._setupSeeders(MODULE, ALLOWED_SCHEMAS, options)
    }
  }

  /**
  * Instala los modelos de un módulo.
  * @param {Module}   MODULE          - Instancia del modulo.
  * @param {String[]} ALLOWED_SCHEMAS - Esquemas que pueden ser instalados.
  * @return {Promise}
  */
  async _setupModels (MODULE) {
    const APP    = this.app
    for (let key in MODULE.models) {
      const task1  = new Loader(` - DROP TABLE ${MODULE.models[key].name}`)
      task1.start()
      await MODULE.models[key].drop({ force: true })
      task1.finish()
    }
    const loaded = []
    APP.log('\n')
    async function _sync (model) {
      if (model.options.schema !== MODULE.config.schema) { return }
      if (model.associations) {
        for (let i in model.associations) {
          const ASSOCIATION = model.associations[i]
          if (ASSOCIATION.associationType === 'BelongsTo') {
            if (!loaded.includes(ASSOCIATION.target.name)) {
              await _sync(ASSOCIATION.target)
            }
          }
        }
      }
      loaded.push(model.name)
      const task2 = new Loader(` - CREATE TABLE ${model.name}`, APP.log)
      task2.start()
      await model.sync({ force: true })
      task2.finish()
    }
    for (let key in MODULE.models) {
      if (!loaded.includes(key)) {
        await _sync(MODULE.models[key])
      }
    }
  }

  /**
  * Instala los seeders de un módulo.
  * @param {Module}   MODULE                       - Instancia del modulo.
  * @param {String[]} ALLOWED_SCHEMAS              - Esquemas que pueden ser instalados.
  * @param {Object}   [options]                    - Opciones de instalación.
  * @param {String}   [options.seedersPath]        - Ruta de la carpeta seeders.
  * @param {String}   [options.seedExt='.seed.js'] - Extension del archivo seed.
  * @return {Promise}
  */
  async _setupSeeders (MODULE, ALLOWED_SCHEMAS, { seedersPath, seedExt }) {
    const APP         = this.app
    const MODULE_NAME = MODULE.config.moduleName
    const SEED_EXT    = seedExt || '.seed.js'
    const loaded      = []
    APP.log('\n')
    const _seed = async (modelName, filePath) => {
      const model = APP[MODULE_NAME].models[modelName]
      if (model.options.schema !== MODULE.config.schema) { return }
      if (model.associations) {
        for (let i in model.associations) {
          if (model.associations[i].associationType === 'BelongsTo') {
            if (!loaded.includes(model.associations[i].target.name)) {
              await util.findAsync(seedersPath, SEED_EXT, async ({ fileName, filePath }) => {
                if (fileName === model.associations[i].target.name) {
                  await _seed(fileName, filePath)
                }
              })
            }
          }
        }
      }
      loaded.push(modelName)
      const task3 = new Loader(` - SEED ${modelName}`)
      task3.start()
      const DATA = require(filePath)(APP)
      try {
        await Seed.create(model, DATA, { schemas: ALLOWED_SCHEMAS })
        task3.finish()
      } catch (err) {
        task3.failed('\n')
        console.log(err)
        process.exit(0)
      }
    }

    await util.findAsync(seedersPath, SEED_EXT, async ({ fileName, filePath }) => {
      if (!loaded.includes(fileName)) {
        await _seed(fileName, filePath)
      }
    })
  }
}

module.exports = Database
