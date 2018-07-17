/** @ignore */ const path   = require('path')
/** @ignore */ const util   = require('../tools/util')
/** @ignore */ const logger = require('../tools/logger')

/**
* Modelo base para crear módulos.
*/
class Module {
  /**
  * Crea una instancia de la clase Module
  * @param {Object} config          - Configuración del módulo.
  * @param {String} [type='MODULE'] - Tipo de módulo.
  */
  constructor (config, type = 'MODULE') {
    /**
    * Configuración.
    * @type {Object}
    */
    this.config               = config
    this.config.moduleType    = type
    this.config.setup         = (typeof config.setup !== 'undefined') ? config.setup : true
    this.config.servicesPath  = this.config.servicesPath || path.resolve(this.config.modulePath, 'services')
    if (!util.isDir(this.config.servicesPath)) this.config.servicesPath = null
  }

  /**
  * Función que se ejecuta cuando se instala la aplicación.
  * @param {Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async onSetup (app) {}

  /**
  * Función que se ejecuta cuando se inicializa la aplicación.
  * @param {Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async onStart (app) {
    if (this.config.servicesPath) this._loadServices(app, this)
  }

  /**
  * Función encargada de cargar todos los servicios de un módulo.
  * @param {Function}       app    - Instancia del servidor express.
  * @param {ResourceModule} MODULE - Instancia del módulo.
  */
  _loadServices (app, MODULE) {
    util.find(MODULE.config.servicesPath, '.service.js', ({ filePath, fileName }) => {
      const SERVICES = require(filePath)(app)
      Object.keys(SERVICES).forEach(key => {
        if (MODULE[key]) {
          throw new Error(`El servicio ${key} ya se encuentra definido dentro del módulo ${MODULE.config.moduleName}.`)
        }
        logger.app(`\x1b[32m [service] \x1b[0m\x1b[2mFunción ${key}\x1b[0m \u2713`)
        MODULE[key] = SERVICES[key]
      })
      logger.app('')
    })
  }
}

module.exports = Module
