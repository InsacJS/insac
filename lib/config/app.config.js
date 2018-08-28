/** @ignore */ const path = require('path')
/** @ignore */ const _    = require('lodash')

/** @ignore */ const util = require('../tools/util')

/** @ignore */ const PROJECT_PATH = process.env.PROJECT_PATH = process.env.PROJECT_PATH || process.cwd()

/**
* Configuración por defecto de las rutas de las carpetas del proyecto.
* @type {Object}
* @property {String} project         - Ruta absoluta de la carpeta del proyecto.
* @property {String} sources='src'   - Ruta absoluta de la carpeta 'src'.
* @property {String} logs='logs'     - Ruta absoluta de la carpeta 'logs'.
* @property {String} public='public' - Ruta absoluta de la carpeta 'public'.
*/
const PATH = {}
PATH.project = process.env.PROJECT_PATH = process.env.PROJECT_PATH || process.cwd()
PATH.sources = process.env.SOURCES_PATH = path.resolve(PATH.project, process.env.SOURCES_PATH || 'src')
PATH.logs    = process.env.LOGS_PATH    = path.resolve(PATH.project, process.env.LOGS_PATH    || 'logs')
PATH.public  = process.env.PUBLIC_PATH  = path.resolve(PATH.project, process.env.PUBLIC_PATH  || 'public')

/**
* @ignore
* Fusiona dos objetos, sin fusionar los arrays cuyo contenido sean de tipo básico.
* @param {Object} objValue - Objeto A
* @param {Object} srcValue - Objeto B
*/
function customizer (objValue, srcValue) {
  if (_.isArray(objValue)) {
    if (objValue.length > 0 && typeof objValue[0] === 'object') {
      return _.merge(objValue, srcValue)
    }
    return srcValue
  }
}

/**
* @ignore
* Devuelve el contenido de un archivo de configuración.
* @param {String} fileName - Nombre del archivo de configuracón.
* @return {Object}
*/
function getConfigFile (fileName) {
  let filesInfo = util.find(PATH.sources, `${fileName}.config.js`)
  const customConfig = (filesInfo.length > 0) ? _.cloneDeep(require(filesInfo[0].filePath)) : {}
  const config = _.cloneDeep(require(`./${fileName}.config.js`))
  _.mergeWith(config, customConfig, customizer)
  setNodeEnv(fileName, config)
  return config
}

/**
* @ignore
* Sincroniza las variables de entorno con los .archivos de configuración,
* dando prioridad a las variables de entorno.
* @param {String} fileName - Nombre del archivo de configuracón.
* @param {Object} config   - Configuración.
*/
function setNodeEnv (fileName, config) {
  switch (fileName) {
    case 'logger':
      if (process.env.COLORS)     { config.colors                  = process.env.COLORS === 'true' } else { process.env.COLORS     = `${config.colors}`                  }
      if (process.env.LOGGER)     { config.enabled                 = process.env.LOGGER === 'true' } else { process.env.LOGGER     = `${config.enabled}`                 }
      if (process.env.LOGS_LEVEL) { config.console.transport.level = process.env.LOGS_LEVEL        } else { process.env.LOGS_LEVEL = `${config.console.transport.level}` }
      break
    case 'server':
      if (process.env.START)    { config.start    = process.env.START === 'true'  } else { process.env.START    = `${config.start}`    }
      if (process.env.LISTEN)   { config.listen   = process.env.LISTEN === 'true' } else { process.env.LISTEN   = `${config.listen}`   }
      if (process.env.PROTOCOL) { config.protocol = process.env.PROTOCOL          } else { process.env.PROTOCOL = `${config.protocol}` }
      if (process.env.HOSTNAME) { config.hostname = process.env.HOSTNAME          } else { process.env.HOSTNAME = `${config.hostname}` }
      if (process.env.PORT)     { config.port     = process.env.PORT              } else { process.env.PORT     = `${config.port}`     }
      if (process.env.NODE_ENV) { config.env      = process.env.NODE_ENV          } else { process.env.NODE_ENV = `${config.env}`      }
      break
    case 'database':
      if (process.env.SQL_LOG) { config.sqlLog          = process.env.SQL_LOG === 'true' } else { process.env.SQL_LOG  = `${config.sqlLog}`          }
      if (process.env.SETUP)   { config.setup           = process.env.SETUP   === 'true' } else { process.env.SETUP    = `${config.setup}`           }
      if (process.env.DB_NAME) { config.database        = process.env.DB_NAME            } else { process.env.DB_NAME  = `${config.database}`        }
      if (process.env.DB_USER) { config.username        = process.env.DB_USER            } else { process.env.DB_USER  = `${config.username}`        }
      if (process.env.DB_PASS) { config.password        = process.env.DB_PASS            } else { process.env.DB_PASS  = `${config.password}`        }
      if (process.env.DIALECT) { config.params.dialect  = process.env.DIALECT            } else { process.env.DIALECT  = `${config.params.dialect}`  }
      if (process.env.DB_HOST) { config.params.host     = process.env.DB_HOST            } else { process.env.DB_HOST  = `${config.params.host}`     }
      if (process.env.DB_PORT) { config.params.port     = process.env.DB_PORT            } else { process.env.DB_PORT  = `${config.params.port}`     }
      if (process.env.DB_TZ)   { config.params.timezone = process.env.DB_TZ              } else { process.env.DB_TZ    = `${config.params.timezone}` }
      break
    case 'apidoc':
      if (process.env.APIDOC) { config.enabled = process.env.APIDOC === 'true' } else { process.env.APIDOC = `${config.enabled}` }
      break
  }
}

/**
* @ignore
* Obtiene la información del proyecto.
* @return {Object}
*/
function getProjectInfo () {
  const INFO = {
    appName      : 'App',
    appVersion   : '1.0.0',
    insacVersion : '1.0.0'
  }
  let insacPackagePath = path.resolve(PROJECT_PATH, 'node_modules/insac/package.json')
  let appPackagePath   = path.resolve(PROJECT_PATH, 'package.json')
  try { INFO.insacVersion = require(insacPackagePath).version } catch (e) {}
  try {
    const appPackage = require(appPackagePath)
    INFO.appName     = _.upperFirst(_.replace(_.words(appPackage.name).toString(), /,/g, ' '))
    INFO.appVersion  = appPackage.version
  } catch (e) {}
  return INFO
}

/**
* Configuración de la aplicación.
* @type {Object}
* @property {Object} PATH     - Configuración de las rutas de las carpetas del proyecto.
* @property {Object} LOGGER   - Configuración de logger.
* @property {Object} SERVER   - Configuración del servidor.
* @property {Object} DATABASE - Configuración de la base de datos.
* @property {Object} APIDOC   - Configuración del apidoc.
* @property {Object} RESPONSE - Configuración del formato de respuesta.
* @property {Object} PROJECT  - Contiene la información básica del proyecto.
*/
const config = {
  PATH     : PATH,
  LOGGER   : getConfigFile('logger'),
  SERVER   : getConfigFile('server'),
  DATABASE : getConfigFile('database'),
  APIDOC   : getConfigFile('apidoc'),
  RESPONSE : getConfigFile('response'),
  PROJECT  : getProjectInfo()
}

// Configuración adicional SERVER
config.SERVER.port = parseInt(`${config.SERVER.port}`)
config.SERVER.protocol = config.SERVER.https ? 'https' : 'http'

// Configuración adicional DATABASE
config.DATABASE.params.logging = config.DATABASE.sqlLog ? sql => console.log(`\n${sql}\n`) : false
config.DATABASE.params.port = parseInt(`${config.DATABASE.params.port}`)
if (config.DATABASE.params.dialect === 'sqlite') {
  delete config.DATABASE.params.timezone
  if (typeof config.DATABASE.params.storage === 'undefined') {
    config.DATABASE.params.storage = `${config.DATABASE.database}.sqlite`
  }
}
if (config.DATABASE.params.dialect === 'mssql') {
  if (typeof config.DATABASE.params.dialectOptions === 'undefined') {
    config.DATABASE.params.dialectOptions = { encrypt: true }
  }
}

module.exports = config
