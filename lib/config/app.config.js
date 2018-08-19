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
  return config
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
  SERVER   : getConfigFile('server'),
  DATABASE : getConfigFile('database'),
  APIDOC   : getConfigFile('apidoc'),
  LOGGER   : getConfigFile('logger'),
  RESPONSE : getConfigFile('response'),
  PROJECT  : getProjectInfo()
}

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
