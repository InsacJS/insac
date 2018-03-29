/** @ignore */ const path   = require('path')
/** @ignore */ const Module = require('./Module')
/** @ignore */ const util   = require('../tools/util')
/** @ignore */ const _      = require('lodash')

/**
* lase optimizada para gestionar los servidos entrantes y salientes.
*/
class ServiceModule extends Module {
  /**
  * Crea una instancia de la clase ServiceModule.
  * @param {Object} config - Configuración del módulo.
  */
  constructor (config) {
    super(config)
    this.config.localPath  = this.config.localPath  || path.resolve(this.config.modulePath, 'local')
    this.config.publicPath = this.config.publicPath || path.resolve(this.config.modulePath, 'public')
  }

  /**
  * Función que se ejecuta cuando se inicializa la aplicación.
  * @param {Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async onStart (app) {
    await super.onStart(app)
    await _loadServices(app, this)
  }
}

/**
* Función encargada de cargar todos los servicios.
* @param {Function}       app    - Instancia del servidor express
* @param {ResourceModule} MODULE - Instancia del módulo.
*/
function _loadServices (app, MODULE) {
  util.find(MODULE.config.localPath, '.service.js', ({ filePath, fileName, dirPath }) => {
    const serviceName = _.camelCase(fileName)
    MODULE[serviceName] = require(filePath)(app)
    app.log(`\x1b[2m [local] ${serviceName}\x1b[0m\n`)
  })
}

module.exports = ServiceModule
