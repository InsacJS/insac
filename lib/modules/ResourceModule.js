/** @ignore */ const _      = require('lodash')
/** @ignore */ const path   = require('path')
/** @ignore */ const Module = require('../core/Module')
/** @ignore */ const util   = require('../tools/util')
/** @ignore */ const logger = require('../tools/logger')

/**
* Módulo optimizado para gestionar los recursos.
*/
class ResourceModule extends Module {
  /**
  * Crea una instancia de la clase ResourceModule.
  * @param {Object} config - Configuración del módulo.
  */
  constructor (config = {}) {
    super(config, 'RESOURCE')
    /**
    * Configuracion.
    * @type {Onject}
    */
    this.config.schema         = this.config.schema        || this.config.moduleName.toLowerCase()
    this.config.seedersPath    = this.config.seedersPath   || path.resolve(this.config.modulePath, 'seeders')
    this.config.modelsPath     = this.config.modelsPath    || path.resolve(this.config.modulePath, 'models')
    this.config.resourcesPath  = this.config.resourcesPath || path.resolve(this.config.modulePath, 'resources')
    this.config.daoPath        = this.config.daoPath       || path.resolve(this.config.modulePath, 'dao')
    if (!util.isDir(this.config.seedersPath))   this.config.seedersPath   = null
    if (!util.isDir(this.config.modelsPath))    this.config.modelsPath    = null
    if (!util.isDir(this.config.resourcesPath)) this.config.resourcesPath = null
    if (!util.isDir(this.config.daoPath))       this.config.daoPath       = null
  }

  /**
  * Función que se ejecuta cuando se instala la aplicación.
  * @param {Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async onSetup (app) {
    await super.onSetup(app)
    if (this.config.modelsPath) await app.DB.importModule(this.config.moduleName, { modelsPath: this.config.modelsPath, daoPath: this.config.daoPath })
    if (this.config.modelsPath) await app.DB.setupModule(this.config.moduleName,  { seedersPath: this.config.seedersPath })
  }

  /**
  * Función que se ejecuta cuando se inicializa la aplicación.
  * @param {Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async onStart (app) {
    await super.onStart(app)
    if (this.config.modelsPath)    await app.DB.importModule(this.config.moduleName, { modelsPath: this.config.modelsPath, daoPath: this.config.daoPath })
    if (this.config.resourcesPath) this._loadRoutes(app, this)
  }

  /**
  * Función encargada de cargar todos los archivos de un recurso.
  * @param {Function}       app    - Instancia del servidor express
  * @param {ResourceModule} MODULE - Instancia del módulo.
  */
  _loadRoutes (app, MODULE) {
    MODULE.config.resources = {}
    util.find(MODULE.config.resourcesPath, '.route.js', ({ filePath, fileName, dirPath }) => {
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
      let   pathSize        = 0
      Object.keys(ROUTES).forEach(key => { if (ROUTES[key].path.length > pathSize) { pathSize = ROUTES[key].path.length } })
      Object.keys(ROUTES).forEach(key => {
        const ROUTE     = ROUTES[key]
        let permissions = []
        if (MIDDLEWARE[key]) { MIDDLEWARE[key].forEach(mw => { if (mw.roles) { permissions = mw.roles } }) }
        ROUTE.key          = key
        ROUTE.resourceName = RESOURCE_MAME
        ROUTE.moduleName   = MODULE_NAME
        ROUTE.name         = `${toWords(_.upperFirst(_.camelCase(`${key}_${RESOURCE_MAME}`)))}`
        ROUTE.group        = `${MODULE_NAME} ${toWords(_.upperFirst(_.camelCase(`${RESOURCE_MAME}`)))}`
        ROUTE.permissions  = permissions
        ROUTE.input        = INPUT[key]      || {}
        ROUTE.output       = OUTPUT[key]     || {}
        ROUTE.middleware   = MIDDLEWARE[key] || []
        ROUTE.controller   = CONTROLLER[key]
        app.APIDOC.router[ROUTE.method.toUpperCase()](ROUTE.path, ROUTE)
        logger.app(`\x1b[32m [route] \x1b[0m\x1b[2m${_.padEnd(` ${ROUTE.method.toUpperCase()}`, 7, ' ')} ${_.padEnd(`${ROUTE.path} `, pathSize + 1, '.')}... ${ROUTE.key}\x1b[0m \u2713`)
      })
      logger.app('')
      MODULE.config.resources[fileName] = ROUTES
    })
  }
}

function toWords (text) { return _.replace((_.words(text)).toString(), /,/g, ' ') }

module.exports = ResourceModule
