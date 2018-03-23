const Sequelize = require('sequelize')
const _         = require('lodash')
const util      = require('../tools/util')
const Task      = require('../tools/Task')

module.exports = (app) => {
  app.config.DATABASE               = app.config.DATABASE               || {}
  app.config.DATABASE.params        = app.config.DATABASE.params        || {}
  app.config.DATABASE.params.define = app.config.DATABASE.params.define || {}

  const DEFINE = _.merge({
    underscored     : true,
    freezeTableName : true,
    timestamps      : true,
    paranoid        : true,
    createdAt       : '_fecha_creacion',
    updatedAt       : '_fecha_modificacion',
    deletedAt       : '_fecha_eliminacion'
  }, app.config.DATABASE.params.define)

  const PARAMS = _.merge({
    dialect          : 'postgres',
    host             : process.env.DB_HOST_NAME,
    port             : process.env.DB_HOST_PORT,
    timezone         : '-04:00',
    lang             : 'es',
    logging          : false,
    operatorsAliases : false
  }, app.config.DATABASE.params)
  PARAMS.define = DEFINE

  const DB_CONFIG = _.merge({
    username : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
  }, app.config.DATABASE)
  DB_CONFIG.params = PARAMS

  const sequelize = new Sequelize(
    DB_CONFIG.database,
    DB_CONFIG.username,
    DB_CONFIG.password,
    DB_CONFIG.params
  )

  const DB = app.DB = { sequelize, Sequelize }

  DB.import = (moduleName, { modelsPath, modelExt, daoPath, daoExt }) => {
    const MODEL_EXT = modelExt || '.model.js'
    const MODULE    = app[moduleName]
    MODULE.models = {}
    util.find(modelsPath, MODEL_EXT, ({ filePath, fileName }) => {
      MODULE.models[fileName] = sequelize.import(filePath)
    })
    Object.keys(MODULE.models).forEach((key) => {
      if ('associate' in MODULE.models[key]) {
        MODULE.models[key].associate(app)
      }
    })
    if (daoPath) {
      MODULE.dao = {}
      const DAO_EXT = daoExt || '.dao.js'
      util.find(daoPath, DAO_EXT, ({ filePath, fileName }) => {
        MODULE.dao[fileName] = require(filePath)(app)
      })
    }
  }

  DB.setup = async function setup (moduleName, { seedersPath, seedExt }) {
    const MODULE = app[moduleName]
    const task1 = new Task(` - CREATE SCHEMA ${MODULE.config.schema}`)
    task1.start()
    await sequelize.dropSchema(MODULE.config.schema, { force: true })
    await sequelize.createSchema(MODULE.config.schema, { force: true })
    task1.finish()
    process.stdout.write('\n')
    const loaded = []
    async function _sync (model) {
      if (model.associations) {
        for (let i in model.associations) {
          if (model.associations[i].associationType === 'BelongsTo') {
            if (!loaded.includes(model.associations[i].target.name)) {
              await _sync(model.associations[i].target)
            }
          }
        }
      }
      loaded.push(model.name)
      const task2 = new Task(` - CREATE TABLE ${model.name}`)
      task2.start()
      await model.sync({ force: true })
      task2.finish()
    }
    for (let key in app[moduleName].models) {
      if (!loaded.includes(key)) {
        await _sync(app[moduleName].models[key])
      }
    }
    if (seedersPath) {
      process.stdout.write('\n')
      const SEED_EXT = seedExt || '.seed.js'
      const loaded = []
      const _seed = async (modelName, filePath) => {
        const model = app[moduleName].models[modelName]
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
        const task3 = new Task(` - SEED ${modelName}`)
        task3.start()
        await require(filePath)(app)
        task3.finish()
      }
      await util.findAsync(seedersPath, SEED_EXT, async ({ fileName, filePath }) => {
        if (!loaded.includes(fileName)) {
          await _seed(fileName, filePath)
        }
      })
    }
  }
}
