/** @ignore */ const Sequelize   = require('sequelize')
/** @ignore */ const path        = require('path')
/** @ignore */ const _           = require('lodash')

/** @ignore */ const SeedCreator = require('../libs/SeedCreator')

/** @ignore */ const util        = require('../tools/util')

/**
* Módulo encargado de gestionar la base de datos.
*/
class Database {
  /**
  * Crea una instancia de la clase Database.
  */
  constructor () {
    /**
    * Modelos que no pertenecen a ningun esquema.
    * @type {Function}
    */
    this.models = {}

    /**
    * Instancia sequelize.
    * @type {Sequelize}
    */
    this.sequelize = null

    /**
    * Referencia hacia la clase Sequelize
    * @type {Sequelize}
    */
    this.Sequelize = Sequelize
  }

  /**
  * Inicializa las propiedades de la instancia.
  * @param {!Function} app - Instancia del servidor express.
  */
  onInit (app) {
    this.models = {}
    this._verifyPackagesForDialect(app, app.config.DATABASE.params.dialect)
    this.sequelize = this._createSequelizeInstance(app)
  }

  /**
  * Importa los modelos de un modulo.
  * @param {!Function} app      - Instancia del servidor express.
  * @param {!Module}   MODULE   - Instancia del módulo.
  * @param {!String}   filePath - Ruta del modelo.
  * @return {SequelizeModel}
  */
  importModel (app, MODULE, filePath) {
    const MODULE_NAME        = MODULE.getName()
    const MODEL              = this.sequelize.import(filePath)
    const MODEL_SCHEMA       = MODEL.options.schema
    MODEL.options.moduleName = MODULE_NAME
    if (!MODEL_SCHEMA) {
      app.DB.models[MODEL.name] = MODEL
    }
    if (MODEL_SCHEMA && MODULE.getSchema() && MODEL_SCHEMA !== MODULE.getSchema()) {
      const data = `  Mueva el modelo al módulo correspondiente o defínalo sin la opción schema.\n`
      app.logger.appError(`El modelo '${MODEL.name}' está definido bajo el esquema '${MODEL_SCHEMA}'.`, data)
      process.exit(1)
    }
    const SIZE = `${MODEL_SCHEMA ? `${MODEL_SCHEMA}.` : ''}${MODEL.name}`.length
    if (SIZE > MODULE._max) { MODULE._max = SIZE }
    return MODEL
  }

  /**
  * Asocia los modelos de un módulo.
  * @param {!Function} app    - Instancia del servidor express.
  * @param {!Module}   MODULE - Instancia del módulo.
  */
  associateModels (app, MODULE) {
    Object.keys(MODULE.models).forEach((key) => {
      if ('associate' in MODULE.models[key]) { MODULE.models[key].associate(app) }
      updateForeignKeys(app, MODULE.models[key])
    })
  }

  /**
  * Crea una instancia de Sequelize con privilegios para crear bases de datos.
  * @param {!Function} app - Instancia del servidor express.
  * @return {Sequelize}
  */
  createRootInstance (app) {
    const DIALECT = app.config.DATABASE.params.dialect
    let database = null
    switch (DIALECT) {
      case 'postgres' : database = 'postgres'; break
      case 'mysql'    : database = null;       break
      case 'mssql'    : database = 'master';   break
      case 'sqlite'   : database = 'database'; break
      default: database = null
    }
    const username = app.config.DATABASE.username
    const password = app.config.DATABASE.password
    const params   = _.cloneDeep(app.config.DATABASE.params)
    return new Sequelize(database, username, password, params)
  }

  /**
  * Elimina una base de datos.
  * @param {!Function} app - Instancia del servidor express.
  */
  async dropDatabase (app) {
    const DATABASE = app.config.DATABASE.database
    let sequelizeROOT
    try {
      sequelizeROOT = this.createRootInstance(app)
      await sequelizeROOT.authenticate()
      await sequelizeROOT.query(`DROP DATABASE ${DATABASE}`)
      app.logger.appVerbose('DROP', `DATABASE ${DATABASE} ... ${app.logger.OK}`)
      app.logger.appVerbose()
    } catch (e) {
      const DIALECT = app.config.DATABASE.params.dialect
      const DATABASE_DOES_NOT_EXISTS = (
        (DIALECT === 'postgres' && e.parent.code   === '3D000')             ||
        (DIALECT === 'mysql'    && e.parent.code   === 'ER_DB_DROP_EXISTS') ||
        (DIALECT === 'mssql'    && e.parent.number === 3701)                ||
        (DIALECT === 'sqlite'   && e.parent.code   === 'SQLITE_ERROR')
      )
      if (e.name === 'SequelizeDatabaseError' && DATABASE_DOES_NOT_EXISTS) {
        app.logger.appVerbose('DROP', `DATABASE ${DATABASE} ... (No existe) ${app.logger.OK}`)
        app.logger.appVerbose()
      } else {
        app.logger.appError('DROP', `DATABASE ${DATABASE} ... ${app.logger.FAIL}`)
        app.logger.appVerbose()
        throw e
      }
    } finally {
      await sequelizeROOT.close()
    }
  }

  /**
  * Crea una base de datos.
  * @param {!Function} app - Instancia del servidor express.
  */
  async createDatabase (app) {
    const DATABASE = app.config.DATABASE.database
    let sequelizeROOT
    try {
      sequelizeROOT = this.createRootInstance(app)
      await sequelizeROOT.authenticate()
      await sequelizeROOT.query(`CREATE DATABASE ${DATABASE}`)
      app.logger.appVerbose('CREATE', `DATABASE ${DATABASE} ... ${app.logger.OK}`)
      app.logger.appVerbose()
    } catch (e) {
      const DIALECT = app.config.DATABASE.params.dialect
      const DATABASE_ALREADY_EXIST = (
        (DIALECT === 'postgres' && e.parent.code   === '42P04')               ||
        (DIALECT === 'mysql'    && e.parent.code   === 'ER_DB_CREATE_EXISTS') ||
        (DIALECT === 'mssql'    && e.parent.number === 1801)                  ||
        (DIALECT === 'sqlite'   && e.parent.code   === 'SQLITE_ERROR')
      )
      if (e.name === 'SequelizeDatabaseError' && DATABASE_ALREADY_EXIST) {
        app.logger.appVerbose('CREATE', `DATABASE ${DATABASE} ... (Ya existe) ${app.logger.OK}`)
        app.logger.appVerbose()
      } else {
        app.logger.appError('CREATE', `DATABASE ${DATABASE} ... ${app.logger.FAIL}`)
        app.logger.appVerbose()
        throw e
      }
    } finally {
      await sequelizeROOT.close()
    }
  }

  /**
  * Elimina un esquema de base de datos.
  * @param {!Function} app    - Instancia del servidor express.
  * @param {!Module}   MODULE - Instancia del módulo.
  */
  async dropSchema (app, MODULE) {
    const schema = MODULE.getSchema()
    try {
      if (await existSchema(app, schema)) {
        await app.DB.sequelize.dropSchema(schema, { force: true })
        app.logger.appVerbose('DROP', `SCHEMA ${schema} ... ${app.logger.OK}`)
        app.logger.appVerbose()
      } else {
        app.logger.appVerbose('DROP', `SCHEMA ${schema} ... (No existe) ${app.logger.OK}`)
        app.logger.appVerbose()
      }
    } catch (e) {
      app.logger.appError('DROP', `SCHEMA ${schema} ... ${app.logger.FAIL}`)
      app.logger.appVerbose()
      throw e
    }
  }

  /**
  * Crea un esquema de base de datos.
  * @param {!Function} app    - Instancia del servidor express.
  * @param {!Module}   MODULE - Instancia del módulo.
  * @return {Promise}
  */
  async createSchema (app, MODULE) {
    const schema = MODULE.getSchema()
    try {
      if (!await existSchema(app, schema)) {
        await app.DB.sequelize.createSchema(schema, { force: true })
        app.logger.appVerbose('CREATE', `SCHEMA ${schema} ... ${app.logger.OK}`)
        app.logger.appVerbose()
      } else {
        app.logger.appVerbose('CREATE', `SCHEMA ${schema} ... (Ya existe) ${app.logger.OK}`)
        app.logger.appVerbose()
      }
    } catch (e) {
      app.logger.appError('CREATE', `SCHEMA ${schema} ... ${app.logger.FAIL}`)
      app.logger.appVerbose()
      throw e
    }
  }

  /**
  * Elimina las tablas que pertenecen a un determinado módulo.
  * @param {!Function} app    - Instancia del servidor express.
  * @param {!Module}   MODULE - Instancia del módulo.
  */
  async dropTables (app, MODULE) {
    const loaded = []
    async function _sync (MODEL) {
      if (MODULE.getName() !== MODEL.options.moduleName) { return }
      if (MODEL.associations) {
        for (let i in MODEL.associations) {
          const ASSOCIATION = MODEL.associations[i]
          if (ASSOCIATION.associationType === 'BelongsTo') {
            if (!loaded.includes(ASSOCIATION.target.name)) {
              await _sync(ASSOCIATION.target)
            }
          }
        }
      }
      await dropTable(app, MODEL)
      loaded.push(MODEL.name)
    }
    for (let key in MODULE.models) {
      if (!loaded.includes(key)) {
        await _sync(MODULE.models[key])
      }
    }
    app.logger.appVerbose()
  }

  /**
  * Crea las tablas que pertenecen a un determinado módulo.
  * @param {!Function} app    - Instancia del servidor express.
  * @param {!Module}   MODULE - Instancia del módulo.
  */
  async createTables (app, MODULE) {
    const loaded = []
    async function _sync (MODEL) {
      if (MODULE.getName() !== MODEL.options.moduleName) { return }
      if (MODEL.associations) {
        for (let i in MODEL.associations) {
          const ASSOCIATION = MODEL.associations[i]
          if (ASSOCIATION.associationType === 'BelongsTo') {
            if (!loaded.includes(ASSOCIATION.target.name)) {
              await _sync(ASSOCIATION.target)
            }
          }
        }
      }
      await createTable(app, MODEL)
      loaded.push(MODEL.name)
    }
    for (let key in MODULE.models) {
      if (!loaded.includes(key)) {
        await _sync(MODULE.models[key])
      }
    }
    app.logger.appVerbose()
  }

  /**
  * Crea los seeders que pertenecen a un determinado módulo.
  * @param {!Function} app    - Instancia del servidor express.
  * @param {!Module}   MODULE - Instancia del módulo.
  */
  async createSeeders (app, MODULE) {
    if (app.config.SERVER.env === 'production') {
      const SEEDERS_PATH = path.resolve(MODULE.config.modulePath, 'seeders/production')
      if (util.isDir(SEEDERS_PATH)) await this._createSeeders(app, MODULE, SEEDERS_PATH)
    } else {
      const SEEDERS_PATH = path.resolve(MODULE.config.modulePath, 'seeders')
      if (util.isDir(SEEDERS_PATH)) await this._createSeeders(app, MODULE, SEEDERS_PATH)
    }
  }

  /**
  * Crea una instancia de la clase Sequelize.
  * @param {!Function} app - Instancia del servidor express.
  * @return {Sequelize}
  */
  _createSequelizeInstance (app) {
    try {
      return new Sequelize(
        app.config.DATABASE.database,
        app.config.DATABASE.username,
        app.config.DATABASE.password,
        app.config.DATABASE.params
      )
    } catch (err) {
      if (err.name === 'SequelizeConnectionError') {
        app.logger.appError('No se pudo conectar con la base de datos.', err.message)
        process.exit(1)
      }
      throw err
    }
  }

  /**
  * Verifica que todos los paquetes según el dialecto seleccionado, se encuentren instalados.
  * @param {!Function} app     - Instancia del servidor express.
  * @param {!String}   dialect - Nombre del dialecto de base de datos.
  */
  _verifyPackagesForDialect (app, dialect) {
    const MSG = 'Cannot find module'
    let packageName
    switch (dialect) {
      case 'postgres' : try { require('pg')      } catch (e) { if (e.message.includes(MSG)) packageName = 'pg'      } break
      case 'mysql'    : try { require('mysql2')  } catch (e) { if (e.message.includes(MSG)) packageName = 'mysql2'  } break
      case 'mssql'    : try { require('tedious') } catch (e) { if (e.message.includes(MSG)) packageName = 'tedious' } break
      case 'sqlite'   : try { require('sqlite3') } catch (e) { if (e.message.includes(MSG)) packageName = 'sqlite3' } break
      default:
        const data = `  Dialectos soportados: postgres, mysql, mssql y sqlite.\n`
        app.logger.appError(null, `No existe el dialecto '${dialect}'.`, data)
    }
    if (packageName) {
      const data = `  Ejecute el comando "npm install --save ${packageName}" para solucionar el problema.\n`
      app.logger.appError(null, `Se requiere el módulo '${packageName}'.`, data)
    }
  }

  /**
  * Instala los seeders de un módulo.
  * @param {!Function} app         - Instancia del servidor express.
  * @param {!Module}   MODULE      - Instancia del modulo.
  * @param {!String}   seedersPath - Ruta del directorio seeders.
  * @return {Promise}
  */
  async _createSeeders (app, MODULE, seedersPath) {
    const loaded     = []
    await app.DB.sequelize.transaction(async (t) => {
      async function _seed (modelName, filePath) {
        const model = MODULE.models[modelName]
        if (model.options.schema && model.options.schema !== MODULE.config.schema) { return }
        if (model.associations) {
          for (let i in model.associations) {
            if (model.associations[i].associationType === 'BelongsTo') {
              if (!loaded.includes(model.associations[i].target.name)) {
                await util.findAsync(seedersPath, '.seed.js', async ({ fileName, filePath, dirName }) => {
                  if (dirName !== 'production' || app.config.SERVER.env === 'production') {
                    if (fileName === model.associations[i].target.name) {
                      await _seed(fileName, filePath)
                    }
                  }
                })
              }
            }
          }
        }
        loaded.push(modelName)
        await createSeed(app, model, t, filePath)
      }

      await util.findAsync(seedersPath, '.seed.js', async ({ fileName, filePath, dirName }) => {
        if (dirName !== 'production' || app.config.SERVER.env === 'production') {
          if (!loaded.includes(fileName)) {
            await _seed(fileName, filePath)
          }
        }
      })
    })
  }
}

/**
* @ignore
* Indica si existe un determinado esquema de base de datos.
* @param {!Function} app    - Instancia del servidor express.
* @param {!String}   schema - Nombre del esquema de base de datos.
* @return {Boolean}
*/
async function existSchema (app, schema) {
  const DATABASE = app.config.DATABASE.database
  const DIALECT  = app.config.DATABASE.params.dialect
  const ALL_SCHEMAS = await app.DB.sequelize.showAllSchemas()
  function existInPostgreSQL () {
    return ALL_SCHEMAS.includes(schema)
  }
  function existInMSSQL () {
    return ALL_SCHEMAS.includes(schema)
  }
  function existInMySql () {
    for (let i in ALL_SCHEMAS) {
      const obj = ALL_SCHEMAS[i]
      const key = `Tables_in_${DATABASE}`
      if (obj[key].startsWith(`${schema}.`)) return true
    }
  }
  function existInSQLite () {
    for (let i in ALL_SCHEMAS) {
      const obj = ALL_SCHEMAS[i]
      if (obj.startsWith(`${schema}.`)) return true
    }
  }
  if (DIALECT === 'postgres') return existInPostgreSQL()
  if (DIALECT === 'mssql')    return existInMSSQL()
  if (DIALECT === 'mysql')    return existInMySql()
  if (DIALECT === 'sqlite')   return existInSQLite()
  return false
}

/**
* @ignore
* Indica si existe una tabla.
* @param {!Function}       app   - Instancia del servidor express.
* @param {!SequelizeModel} MODEL - Instancia de un modelo.
* @return {Boolean}
*/
async function existTable (app, MODEL) {
  try {
    const schema = MODEL.options.schema ? `${MODEL.options.schema}.` : ''
    await app.DB.sequelize.query(`SELECT 1 FROM ${schema}${MODEL.name}`)
    return true
  } catch (e) {
    const DIALECT = app.config.DATABASE.params.dialect
    const TABLE_DOES_NOT_EXISTS = (
      (DIALECT === 'postgres' && e.parent.code   === '42P01')            || // ok
      (DIALECT === 'mysql'    && e.parent.code   === 'ER_NO_SUCH_TABLE') || // ok
      (DIALECT === 'mssql'    && e.parent.number === 208)                ||
      (DIALECT === 'sqlite'   && e.parent.code   === 'SQLITE_ERROR')
    )
    if (e.name === 'SequelizeDatabaseError' && TABLE_DOES_NOT_EXISTS) {
      return false
    }
    throw e
  }
}

/**
* @ignore
* Elimina una tabla.
* @param {!Function}       app   - Instancia del servidor express.
* @param {!SequelizeModel} MODEL - Instancia de un modelo.
*/
async function dropTable (app, MODEL) {
  const MAX          = app[MODEL.options.moduleName]._max + 4
  const schema       = MODEL.options.schema ? `${MODEL.options.schema}.` : ''
  const tableNameLog = `${_.padEnd(`${schema}${MODEL.name} `, MAX, '.')}`
  try {
    if (!await existTable(app, MODEL)) {
      app.logger.appVerbose('DROP', `TABLE ${tableNameLog} (No existe) ${app.logger.OK}`)
    } else {
      await MODEL.drop({ force: true })
      app.logger.appVerbose('DROP', `TABLE ${tableNameLog} ${app.logger.OK}`)
    }
  } catch (e) {
    app.logger.appError('DROP', `TABLE ${tableNameLog} ${app.logger.FAIL}`)
    app.logger.appVerbose()
    throw e
  }
}

/**
* @ignore
* Crea una tabla.
* @param {!Function}       app   - Instancia del servidor express.
* @param {!SequelizeModel} MODEL - Instancia de un modelo.
*/
async function createTable (app, MODEL) {
  const MAX          = app[MODEL.options.moduleName]._max + 4
  const schema       = MODEL.options.schema ? `${MODEL.options.schema}.` : ''
  const tableNameLog = `${_.padEnd(`${schema}${MODEL.name} `, MAX, '.')}`
  try {
    if (await existTable(app, MODEL)) {
      app.logger.appVerbose('CREATE', `TABLE ${tableNameLog} (Ya existe) ${app.logger.OK}`)
    } else {
      await MODEL.sync({ force: true })
      app.logger.appVerbose('CREATE', `TABLE ${tableNameLog} ${app.logger.OK}`)
    }
  } catch (e) {
    app.logger.appError('CREATE', `TABLE ${tableNameLog} ${app.logger.FAIL}`)
    app.logger.appVerbose()
    throw e
  }
}

/**
* @ignore
* Crea los registros de un fichero seed.
* @param {!Function}            app      - Instancia del servidor express.
* @param {!SequelizeModel}      MODEL    - Instancia de un modelo.
* @param {SequelizeTransaction} t        - Transacción creada por sequelize.
* @param {!String}              filePath - Ruta del archivo seed.
*/
async function createSeed (app, MODEL, t, filePath) {
  const MAX         = app[MODEL.options.moduleName]._max + 5
  const DATA        = await util.loadFile(app, filePath)
  const schemas     = getAllSetupSchemas(app)
  const fileNameLog = _.padEnd(`${MODEL.name}.seed.js `, MAX, '.')
  try {
    const result = await SeedCreator.create(MODEL, DATA, { schemas, logger: app.logger, transaction: t })
    app.logger.appInfo('INSERT', `${fileNameLog} (Se insertaron ${result.entries} registros en ${result.elapsedTime} seg.) ${app.logger.OK}`)
    app.logger.appVerbose()
  } catch (e) {
    app.logger.appError('INSERT', `${fileNameLog} ${app.logger.FAIL}`)
    app.logger.appVerbose()
    throw e
  }
}

/**
* @ignore
* Actualiza las propiedades de las claves foráneas.
* @param {!Function}       app   - Instancia del servidor express.
* @param {!SequelizeModel} MODEL - Instancia de un modelo.
*/
function updateForeignKeys (app, MODEL) {
  Object.keys(MODEL.attributes).forEach(fieldName => {
    const FIELD = MODEL.attributes[fieldName]
    if (FIELD.references) {
      const F_TARGET = FIELD.targetKey
      const F_MODEL = FIELD.references.model
      let F_MODEL_INSTANCE
      if (typeof F_MODEL === 'string') {
        F_MODEL_INSTANCE = app.DB.models[F_MODEL]
      } else {
        const F_SCHEMA = FIELD.references.model.schema
        const F_TABLE  = FIELD.references.model.tableName
        const F_MODULE = F_SCHEMA.toUpperCase()
        F_MODEL_INSTANCE = app[F_MODULE].models[F_TABLE]
      }
      FIELD.validate = F_MODEL_INSTANCE.attributes[F_TARGET].validate
      FIELD.comment  = FIELD.comment || F_MODEL_INSTANCE.attributes[F_TARGET].comment
      FIELD.example  = FIELD.example || F_MODEL_INSTANCE.attributes[F_TARGET].example
    }
  })
}

/**
* @ignore
* Obtiene una lista de todos los esquemas que pueden ser instalados.
* @param {!Function} app - Instancia del servidor express.
* @return {String[]}
*/
function getAllSetupSchemas (app) {
  const ALLOWED_SCHEMAS = []
  app.modules.forEach(modName => {
    if (app[modName] && app[modName].config.setup && app[modName].config.schema) {
      ALLOWED_SCHEMAS.push(app[modName].config.schema)
    }
  })
  return ALLOWED_SCHEMAS
}

module.exports = Database
