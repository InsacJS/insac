/**
* Modelo base para crear módulos.
*/
class Module {
  /**
  * Crea una instancia de la clase Module
  */
  constructor (config) {
    /**
    * Configuracion.
    * @type {Object}
    */
    this.config = {
      moduleName   : config.moduleName,
      modulePath   : config.modulePath,
      setupEnabled : (typeof config.enableSetup !== 'undefined') ? config.enableSetup : true
    }
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
