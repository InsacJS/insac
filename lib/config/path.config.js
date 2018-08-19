/** @ignore */ const path = require('path')

/** @ignore */ const PROJECT_PATH = process.env.PROJECT_PATH

/**
* Configuración de las rutas de las carpetas del proyecto.
* @type {Object}
*/
const PATH = {
  project : PROJECT_PATH,
  modules : path.resolve(PROJECT_PATH, 'src/modules'),
  config  : path.resolve(PROJECT_PATH, 'src/config'),
  hooks   : path.resolve(PROJECT_PATH, 'src/hooks'),
  tools   : path.resolve(PROJECT_PATH, 'src/tools'),
  logs    : path.resolve(PROJECT_PATH, 'logs'),
  public  : path.resolve(PROJECT_PATH, 'public'),
  apidoc  : path.resolve(PROJECT_PATH, 'public/apidoc')
}

module.exports = PATH
