const path   = require('path')
const _      = require('lodash')
const Module = require('../Module')
const util   = require('../../tools/util')

class ResourceModule extends Module {
  constructor (moduleName, modulePath, config = {}) {
    super(moduleName, modulePath)
    this.config.schema      = config.schema      || moduleName.toLowerCase()
    this.config.seedersPath = config.seedersPath || path.resolve(modulePath, 'seeders')
    this.config.modelsPath  = config.modelsPath  || path.resolve(modulePath, 'models')
    this.config.routesPath  = config.routesPath  || path.resolve(modulePath, 'routes')
    this.config.daoPath     = config.daoPath     || path.resolve(modulePath, 'dao')
  }
  async onSetup (app) {
    await super.onSetup(app)
    await app.DB.import(this.config.moduleName, { modelsPath: this.config.modelsPath, daoPath: this.config.daoPath })
    await app.DB.setup(this.config.moduleName, { seedersPath: this.config.seedersPath })
  }
  async onStart (app) {
    await super.onStart(app)
    await app.DB.import(this.config.moduleName, { modelsPath: this.config.modelsPath, daoPath: this.config.daoPath })
    await _loadRoutes(app, this)
  }
}

function _loadRoutes (app, MODULE) {
  MODULE.config.resources = {}
  util.find(MODULE.config.routesPath, '.route.js', ({ filePath, fileName, dirPath }) => {
    const INPUT_PATH      = path.resolve(dirPath, `${fileName}.input.js`)
    const OUTPUT_PATH     = path.resolve(dirPath, `${fileName}.output.js`)
    const MIDDLEWARE_PATH = path.resolve(dirPath, `${fileName}.middleware.js`)
    const CONTROLLER_PATH = path.resolve(dirPath, `${fileName}.controller.js`)
    const ROUTES          = require(filePath)(app)
    const INPUT           = (util.isFile(INPUT_PATH))      ? require(INPUT_PATH)(app)      : {}
    const OUTPUT          = (util.isFile(OUTPUT_PATH))     ? require(OUTPUT_PATH)(app)     : {}
    const MIDDLEWARE      = (util.isFile(MIDDLEWARE_PATH)) ? require(MIDDLEWARE_PATH)(app) : {}
    const CONTROLLER      = (util.isFile(CONTROLLER_PATH)) ? require(CONTROLLER_PATH)(app) : {}
    const RESOURCE_MAME   = fileName
    const MODULE_NAME     = MODULE.config.moduleName
    Object.keys(ROUTES).forEach(key => {
      const ROUTE = ROUTES[key]
      ROUTE.key          = key
      ROUTE.resourceName = RESOURCE_MAME
      ROUTE.moduleName   = MODULE_NAME
      ROUTE.name         = `[${MODULE_NAME}] ${_.camelCase(`${key}_${RESOURCE_MAME}`)}`
      ROUTE.group        = `${MODULE_NAME} ${_.upperFirst(_.camelCase(`${RESOURCE_MAME}`))}`
      ROUTE.input        = INPUT[key]      || {}
      ROUTE.output       = OUTPUT[key]     || {}
      ROUTE.middleware   = MIDDLEWARE[key] || []
      ROUTE.controller   = CONTROLLER[key]
      app.APIDOC[ROUTE.method.toUpperCase()](ROUTE.path, ROUTE)
    })
    MODULE.config.resources[fileName] = ROUTES
  })
}

module.exports = ResourceModule
