// /* global UTIL */
// const { Seed } = require('insac-seed')
const { Seed } = require('insac-seed')
const Sequelize = require('sequelize')
const UTIL = require('../tools/Util')

module.exports = (app) => {
  /**
  * |=============================================================|
  * |------------ BASE DE DATOS ----------------------------------|
  * |=============================================================|
  */
  const DB_CONFIG = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    params: {
      dialect: 'postgres',
      host: process.env.DB_HOST_NAME,
      port: process.env.DB_HOST_PORT,
      timezone: '-04:00',
      lang: 'es',
      logging: false,
      define: {
        underscored: true,
        freezeTableName: true,
        timestamps: true,
        createdAt: '_fecha_creacion',
        updatedAt: '_fecha_modificacion'
      },
      operatorsAliases: false
    }
  }
  if (process.env.NODE_ENV === 'development' && process.env.LOGGER_SQL && process.env.LOGGER_SQL === 'true') {
    DB_CONFIG.params.logging = (sql) => { global.LOGGER.info(`\n${sql}\n`) }
  }
  const sequelize = new Sequelize(
    DB_CONFIG.database,
    DB_CONFIG.username,
    DB_CONFIG.password,
    DB_CONFIG.params
  )

  app.DB = { sequelize, Sequelize, models: sequelize.models }
  app.DB.setup = async function setup ({ modelsPath, seedersPath, moduleName, modelExt, seedExt }) {
    let installed = false
    for (let key in app.DB.models) {
      if (app.DB.models[key].moduleName === moduleName) {
        await app.DB.models[key].sync({ force: true })
        console.log(` - CREATE TABLE ${key} \u2713`)
        installed = true
      }
    }
    if (installed) {
      const SEED_EXT = seedExt || '.seed.js'
      if (seedersPath) {
        await UTIL.findAsync(seedersPath, SEED_EXT, async ({ filePath, fileName }) => {
          const seed = async (modelName, data) => {
            await Seed.create(sequelize, modelName, data)
            // console.log(` - SEED ${modelName} \u2713`)
          }
          await require(filePath)(seed)
        })
      }
    }
  }
  app.DB.import = ({ modelsPath, moduleName, modelExt }) => {
    const MODEL_EXT = modelExt || '.model.js'
    UTIL.find(modelsPath, MODEL_EXT, ({ filePath, fileName }) => {
      if (app.DB.models[fileName]) {
        throw new Error(`El modelo '${fileName}' ya se encuentra definido.`)
      }
      sequelize.import(filePath)
      sequelize.models[fileName].moduleName = moduleName
    })
    UTIL.find(modelsPath, MODEL_EXT, ({ fileName }) => {
      Object.keys(sequelize.models).forEach((key) => {
        if ((key === fileName) && ('associate' in sequelize.models[key])) {
          sequelize.models[key].associate(sequelize.models)
          app.FIELD.define(key, sequelize.models[key].attributes)
        }
      })
    })
  }

  /**
  * |=============================================================|
  * |------------ OBJETO DE ACCESO A DATOS (DAO) -----------------|
  * |=============================================================|
  */
  app.DAO = {}

  app.DAO.import = ({ daoPath, daoExt }) => {
    const DAO_EXT = daoExt || '.dao.js'
    UTIL.find(daoPath, DAO_EXT, ({ filePath, fileName }) => {
      app.DAO[fileName] = require(filePath)(app)
    })
  }
}
