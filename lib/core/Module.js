/** @ignore */ const path = require('path')
/** @ignore */ const util = require('../tools/util')

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
    this.config.setup      = (typeof config.setup !== 'undefined') ? config.setup : true
    this.config.tasksPath  = this.config.tasksPath || path.resolve(this.config.modulePath, 'tasks')
    if (!util.isDir(this.config.tasksPath)) this.config.tasksPath = null
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
    if (this.config.tasksPath) this._loadTasks(app, this)
  }

  /**
  * Función encargada de cargar todas las tareas de un módulo.
  * @param {Function}       app    - Instancia del servidor express.
  * @param {ResourceModule} MODULE - Instancia del módulo.
  */
  _loadTasks (app, MODULE) {
    util.find(MODULE.config.tasksPath, '.task.js', ({ filePath, fileName }) => {
      const TASKS = require(filePath)(app)
      Object.keys(TASKS).forEach(key => {
        if (MODULE[key]) { throw new Error(`La tarea ${key} ya se encuentra definida dentro del módulo ${MODULE.config.moduleName}.`) }
        app.log(`\x1b[2m - [task] ${key}\x1b[0m\n`)
        MODULE[key] = TASKS[key]
      })
    })
  }
}

module.exports = Module
