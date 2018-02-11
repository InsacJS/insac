const { Options } = require('insac-options')
const UTIL = require('../../tools/Util')
const Module = require('../Module')
const path = require('path')
const _ = require('lodash')
const fs = require('fs')

class ResourceModule extends Module {
  constructor (app, CONFIG) {
    super(app, CONFIG)
    this.daoPath = CONFIG.daoPath || path.resolve(this.path, 'dao')
    this.routesPath = CONFIG.routesPath || path.resolve(this.path, 'routes')
    this.modelsPath = CONFIG.modelsPath || path.resolve(this.path, 'models')
    this.fieldsPath = CONFIG.fieldsPath || path.resolve(this.path, 'fields')
    this.seedersPath = CONFIG.seedersPath || path.resolve(this.path, 'seeders')
    this.daoExt = CONFIG.daoExt || '.dao.js'
    this.routeExt = CONFIG.routeExt || '.route.js'
    this.modelExt = CONFIG.modelExt || '.model.js'
    this.fieldExt = CONFIG.fieldExt || '.field.js'
    this.seedExt = CONFIG.seedExt || '.seed.js'
    this.existDao = fs.existsSync(this.daoPath) && fs.statSync(this.daoPath).isDirectory()
    this.existRoutes = fs.existsSync(this.routesPath) && fs.statSync(this.routesPath).isDirectory()
    this.existModels = fs.existsSync(this.modelsPath) && fs.statSync(this.modelsPath).isDirectory()
    this.existFields = fs.existsSync(this.fieldsPath) && fs.statSync(this.fieldsPath).isDirectory()
    this.existSeeders = fs.existsSync(this.seedersPath) && fs.statSync(this.seedersPath).isDirectory()
    this.DEFAULT = {
      plainOutput: CONFIG.plain || false,
      input: CONFIG.input || {},
      output: CONFIG.output || {}
    }
    if (this.existModels) {
      app.DB.import({
        modelsPath: this.modelsPath,
        moduleName: this.name,
        modelExt: this.modelExt
      })
    }
    if (this.existDao) {
      app.DAO.import({
        daoPath: this.daoPath,
        daoExt: this.daoExt
      })
    }
    app.FIELD.import(path.resolve(__dirname, 'fields'), { ext: '.field.js' })
    if (this.existModels) { app.FIELD.import(this.modelsPath, { ext: this.modelExt }) }
    if (this.existFields) { app.FIELD.import(this.fieldsPath, { ext: this.fieldExt }) }
  }
  async onSetup (app) {
    await super.onSetup(app)
    if (this.existModels) {
      await app.DB.setup({
        modelsPath: this.modelsPath,
        seedersPath: this.seedersPath,
        moduleName: this.name,
        modelExt: this.modelExt,
        seedExt: this.seedExt
      })
    }
  }
  async onStart (app) {
    await super.onStart(app)
    if (this.existRoutes) {
      loadRoutes(app, this.routesPath, this.name, { routeExt: this.routeExt }, this.DEFAULT)
    }
  }
}

function loadRoutes (app, routesPath, moduleName = 'API', options = {}, DEFAULT) {
  const routeExt = options.routeExt || '.route.js'
  UTIL.find(routesPath, routeExt, ({ filePath, dirPath, fileName }) => {
    const BASE_PATH = `${dirPath}/${fileName}`
    const options = {
      INPUT: getContent(app, `${BASE_PATH}.input.js`),
      OUTPUT: getContent(app, `${BASE_PATH}.output.js`),
      MIDDLEWARE: getContent(app, `${BASE_PATH}.middleware.js`),
      CONTROLLER: getContent(app, `${BASE_PATH}.controller.js`),
      fileName,
      moduleName,
      DEFAULT
    }
    const router = {
      GET: (path, key, properties) => { addRoute(app, 'GET', path, key, properties, options) },
      POST: (path, key, properties) => { addRoute(app, 'POST', path, key, properties, options) },
      PUT: (path, key, properties) => { addRoute(app, 'PUT', path, key, properties, options) },
      DELETE: (path, key, properties) => { addRoute(app, 'DELETE', path, key, properties, options) }
    }
    require(filePath)(router)
    console.log()
  })
}

function addRoute (app, method, path, key, properties = {}, options) {
  const fileName = options.fileName
  if (!options.CONTROLLER[key]) {
    throw new Error(`No existe un controlador con la clave '${key}'. RECURSO: ${fileName} RUTA: ${path} `)
  }
  properties.key = key
  properties.input = Object.assign(_.clone(options.DEFAULT.input[key] || {}), options.INPUT[key])
  properties.output = Object.assign(_.clone(options.DEFAULT.output[key] || {}), options.OUTPUT[key])
  properties.name = _.camelCase(`${key}_${fileName}`)
  properties.group = `${options.moduleName} ${fileName[0].toUpperCase()}${_.camelCase(fileName).substr(1)}`
  properties.controller = _createController(app, key, properties, options)
  app.APIDOC[method](path, properties)
}

function _createController (app, key, properties, options) {
  const plainOutput = (typeof properties.plainOutput !== 'undefined') ? properties.plainOutput : options.plainOutput
  return async (req, res) => {
    try {
      const QUERY = req.query || {}
      const MODEL = app.DB.models[options.fileName]
      if (key === 'listar') { _updateQueryForList(app, QUERY, MODEL) }
      req.options = Options.create({ query: QUERY, output: options.OUTPUT[key], model: MODEL, keys: true })
      if (options.MIDDLEWARE[key]) {
        if (Array.isArray(options.MIDDLEWARE[key])) {
          options.MIDDLEWARE[key].forEach(async middleware => { await middleware(req) })
        } else { await options.MIDDLEWARE[key](req) }
      }
      const success = (data, message, count) => {
        data = Options.filter(data, { query: QUERY, output: options.OUTPUT[key], plainOutput })
        data = JSON.parse(JSON.stringify(data))
        res.success200(data, message, count)
      }
      await options.CONTROLLER[key](req, success)
    } catch (error) { res.error(error) }
  }
}

function _updateQueryForList (app, QUERY, MODEL) {
  QUERY.order = QUERY.order || app.FIELD.models.query('order').defaultValue
  QUERY.limit = QUERY.limit || app.FIELD.models.query('limit').defaultValue
  const PAGE = QUERY.page || app.FIELD.models.query('page').defaultValue
  QUERY.offset = (PAGE - 1) * QUERY.limit
  if (MODEL) {
    QUERY.distinct = true
    QUERY.col = MODEL.primaryKeyAttributes[0]
  }
}

function getContent (app, filePath) {
  try { return require(filePath)(app) } catch (error) {
    if (error.message === `Cannot find module '${filePath}'`) { return {} } else { throw error }
  }
}

module.exports = ResourceModule
