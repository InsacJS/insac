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
    this.config            = config
    this.config.moduleType = type
    this.config.setup = (typeof config.setup !== 'undefined') ? config.setup : true
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
  async onStart (app) {}
}

module.exports = Module
