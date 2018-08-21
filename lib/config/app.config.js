/** @ignore */ const path = require('path')
/** @ignore */ const _    = require('lodash')

/** @ignore */ const util = require('../tools/util')

/** @ignore */ const PROJECT_PATH = process.env.PROJECT_PATH = process.env.PROJECT_PATH || process.cwd()

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

/** @ignore */
function getConfigFile (fileName) {
  let filesInfo = util.find(path.resolve(PROJECT_PATH), `${fileName}.config.js`, null, {
    ignoredPaths: [
      path.resolve(PROJECT_PATH, 'node_modules'),
      path.resolve(PROJECT_PATH, 'public'),
      path.resolve(PROJECT_PATH, 'test')
    ]
  })
  const customConfig = (filesInfo.length > 0) ? _.cloneDeep(require(filesInfo[0].filePath)) : {}
  const config = _.cloneDeep(require(`./${fileName}.config.js`))
  _.mergeWith(config, customConfig, customizer)
  setNodeEnv(fileName, config)
  return config
}

function setNodeEnv (fileName, config) {
  switch (fileName) {
    case 'logger':
      if (process.env.COLORS) { config.colors  = process.env.COLORS === 'true' } else { process.env.COLORS = `${config.colors}`  }
      if (process.env.LOGGER) { config.enabled = process.env.LOGGER === 'true' } else { process.env.LOGGER = `${config.enabled}` }
      break
    case 'server':
      if (process.env.START)    { config.start    = process.env.START === 'true' } else { process.env.START    = `${config.start}`    }
      if (process.env.PROTOCOL) { config.protocol = process.env.PROTOCOL         } else { process.env.PROTOCOL = `${config.protocol}` }
      if (process.env.HOSTNAME) { config.hostname = process.env.HOSTNAME         } else { process.env.HOSTNAME = `${config.hostname}` }
      if (process.env.PORT)     { config.port     = process.env.PORT             } else { process.env.PORT     = `${config.port}`     }
      if (process.env.NODE_ENV) { config.env      = process.env.NODE_ENV         } else { process.env.NODE_ENV = `${config.env}`      }
      break
    case 'database':
      if (process.env.SQL_LOG) { config.sqlLog          = process.env.SQL_LOG === 'true' } else { process.env.SQL_LOG  = `${config.sqlLog}`          }
      if (process.env.SETUP)   { config.setup           = process.env.SETUP   === 'true' } else { process.env.SETUP    = `${config.setup}`           }
      if (process.env.DIALECT) { config.dialect         = process.env.DIALECT            } else { process.env.DIALECT  = `${config.dialect}`         }
      if (process.env.DB_HOST) { config.params.host     = process.env.DB_HOST            } else { process.env.DB_HOST  = `${config.params.host}`     }
      if (process.env.DB_PORT) { config.params.port     = process.env.DB_PORT            } else { process.env.DB_PORT  = `${config.params.port}`     }
      if (process.env.DB_NAME) { config.database        = process.env.DB_NAME            } else { process.env.DB_NAME  = `${config.database}`        }
      if (process.env.DB_USER) { config.username        = process.env.DB_USER            } else { process.env.DB_USER  = `${config.username}`        }
      if (process.env.DB_PASS) { config.password        = process.env.DB_PASS            } else { process.env.DB_PASS  = `${config.password}`        }
      if (process.env.DB_TZ)   { config.params.timezone = process.env.DB_TZ              } else { process.env.DB_TZ    = `${config.params.timezone}` }
      break
    case 'apidoc':
      if (process.env.APIDOC) { config.enabled = process.env.APIDOC === 'true' } else { process.env.APIDOC = `${config.enabled}` }
      break
  }
}

/** @ignore */
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
*/
const config = {
  PATH     : getConfigFile('path'),
  LOGGER   : getConfigFile('logger'),
  SERVER   : getConfigFile('server'),
  DATABASE : getConfigFile('database'),
  APIDOC   : getConfigFile('apidoc'),
  RESPONSE : getConfigFile('response'),
  PROJECT  : getProjectInfo()
}

// Optimización de la configuración SERVER
config.SERVER.port = parseInt(config.SERVER.port)

// Optimización de la configuración DATABASE
config.DATABASE.params.logging = config.DATABASE.sqlLog ? sql => console.log(sql) : false
config.DATABASE.params.port = parseInt(config.DATABASE.params.port)
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
