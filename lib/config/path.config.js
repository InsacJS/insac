/** @ignore */ const path = require('path')

/** @ignore */ const PROJECT_PATH = process.env.PROJECT_PATH

/**
* Configuración de las rutas de las carpetas del proyecto.
* @type {Object}
*/
const PATH = {
  project : PROJECT_PATH,
  sources : path.resolve(PROJECT_PATH, 'src'),
  logs    : path.resolve(PROJECT_PATH, 'logs'),
  public  : path.resolve(PROJECT_PATH, 'public')
}

module.exports = PATH
