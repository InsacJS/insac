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
    this.plainOutput = (CONFIG.plainOutput === true) || false
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
    if (this.existRoutes) { _loadRoutes(app, this) }
  }
}

function _loadRoutes (app, MODULE) {
  UTIL.find(MODULE.routesPath, MODULE.routeExt, ({ filePath, dirPath, fileName }) => {
    const BASE_PATH = path.resolve(dirPath, fileName)
    const RESOURCE = {
      name: fileName,
      moduleName: MODULE.name,
      plainOutput: MODULE.plainOutput,
      input: _getContent(app, `${BASE_PATH}.input.js`),
      output: _getContent(app, `${BASE_PATH}.output.js`),
      middleware: _getContent(app, `${BASE_PATH}.middleware.js`),
      controller: _getContent(app, `${BASE_PATH}.controller.js`),
      defaultInput: _getContent(app, path.resolve(MODULE.path, `default/default.input.js`)),
      defaultMiddleware: _getContent(app, path.resolve(MODULE.path, `default/default.middleware.js`))
    }
    const router = {
      GET: (...args) => { _addRoute(app, 'GET', RESOURCE, ...args) },
      POST: (...args) => { _addRoute(app, 'POST', RESOURCE, ...args) },
      PUT: (...args) => { _addRoute(app, 'PUT', RESOURCE, ...args) },
      DELETE: (...args) => { _addRoute(app, 'DELETE', RESOURCE, ...args) }
    }
    require(filePath)(router)
    console.log()
  })
}

function _addRoute (app, method, RESOURCE, path, key, properties = {}) {
  if (!RESOURCE.controller[key]) {
    throw new Error(`No existe un controlador con la clave '${key}'. RECURSO: ${RESOURCE.name} RUTA: ${path} `)
  }
  properties.key = key
  properties.path = path
  properties.resourceName = RESOURCE.name
  properties.moduleName = RESOURCE.moduleName
  properties.plainOutput = (typeof properties.plainOutput !== 'undefined') ? properties.plainOutput : RESOURCE.plainOutput
  properties.input = Object.assign(_.clone(RESOURCE.defaultInput[key] || {}), RESOURCE.input[key] || {})
  properties.output = RESOURCE.output[key] || {}
  _updateFieldsWithGroup(app, properties)
  properties.name = _.camelCase(`${key}_${RESOURCE.name}`)
  properties.group = `${RESOURCE.moduleName} ${RESOURCE.name[0].toUpperCase()}${_.camelCase(RESOURCE.name).substr(1)}`
  properties.controller = _createController(app, properties, RESOURCE)
  _validatePath(path, properties)
  app.APIDOC[method](path, properties)
}

function _validatePath (path, properties) {
  if (properties.input.params) {
    Object.keys(properties.input.params).forEach(prop => {
      if (path.indexOf(`:${prop}`) === -1) {
        throw new Error(`Parámetro no definido. PARAM: ${prop} RUTA: ${path}`)
      }
    })
  }
}

function _updateFieldsWithGroup (app, properties) {
  try {
    const resourceName = properties.resourceName
    if (properties.input.headers) { properties.input.headers = app.FIELD.group(resourceName, properties.input.headers) }
    if (properties.input.params) { properties.input.params = app.FIELD.group(resourceName, properties.input.params) }
    if (properties.input.query) { properties.input.query = app.FIELD.group(resourceName, properties.input.query) }
    if (properties.input.body) { properties.input.body = app.FIELD.group(resourceName, properties.input.body) }
    properties.output = app.FIELD.group(resourceName, properties.output)
  } catch (error) {
    throw new Error(`Fallo en la definición de campos. Recurso: ${properties.resourceName}. Ruta: ${properties.path}. key: ${properties.key}. Parent: ${error.message}`)
  }
}

function _createController (app, properties, RESOURCE) {
  const key = properties.key
  const MODEL = app.DB.models[properties.resourceName]
  const defaultOrder = app.FIELD.models.query('order').defaultValue
  const defaultLimit = app.FIELD.models.query('limit').defaultValue
  const defaultPage = app.FIELD.models.query('page').defaultValue
  const MIDDLEWARES = _createMiddlewares(RESOURCE, key)
  const CONTROLLER = RESOURCE.controller[key]
  function createOptions (req) {
    if (key === 'listar') { _updateQueryForList(req.query, MODEL, defaultOrder, defaultLimit, defaultPage) }
    return Options.create({ query: req.query, output: properties.output, model: MODEL, keys: true })
  }
  return async (req, res) => {
    try {
      req.options = createOptions(req)
      MIDDLEWARES.forEach(async middleware => {
        if (res.headersSent === false) { await middleware(req, res) }
      })
      if (res.headersSent === false) { await CONTROLLER(req, res) }
    } catch (error) { if (res.headersSent === false) { res.error(error) } }
  }
}

function _createMiddlewares (RESOURCE, key) {
  let middlewares = []
  if (RESOURCE.defaultMiddleware[key]) {
    if (!Array.isArray(RESOURCE.defaultMiddleware[key])) { RESOURCE.defaultMiddleware[key] = [RESOURCE.defaultMiddleware[key]] }
    middlewares = middlewares.concat(RESOURCE.defaultMiddleware[key])
  }
  if (RESOURCE.middleware[key]) {
    if (!Array.isArray(RESOURCE.middleware[key])) { RESOURCE.middleware[key] = [RESOURCE.middleware[key]] }
    middlewares = middlewares.concat(RESOURCE.middleware[key])
  }
  return middlewares
}

function _updateQueryForList (QUERY, MODEL, defaultOrder, defaultLimit, defaultPage) {
  QUERY.order = QUERY.order || defaultOrder
  QUERY.limit = QUERY.limit || defaultLimit
  const PAGE = QUERY.page || defaultPage
  QUERY.offset = (PAGE >= 1) ? ((PAGE - 1) * QUERY.limit) : 0
  if (MODEL) {
    QUERY.distinct = true
    QUERY.col = MODEL.primaryKeyAttributes[0]
  }
}

function _getContent (app, filePath) {
  try { return require(filePath)(app) } catch (error) {
    if (error.message === `Cannot find module '${filePath}'`) { return {} } else { throw error }
  }
}

module.exports = ResourceModule
