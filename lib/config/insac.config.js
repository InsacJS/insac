const path   = require('path')
const _      = require('lodash')
const util   = require('../tools/util')
const config = require('./app.config.js')

const INSAC_CONFIG_PATH = path.resolve(process.cwd(), 'src/config/insac.config.js')
const insacConfig       = util.isFile(INSAC_CONFIG_PATH) ? require(INSAC_CONFIG_PATH) : {}

// |=============================================================|
// |---------- CONFIGURACIÓN DEL FORMATO DE RESPUESTA -----------|
// |=============================================================|

exports.RESPONSE = _.merge({
  successFormat: (result) => {
    const RESULT = {
      status  : result.status,
      message : result.message
    }
    if (result.metadata) { RESULT.metadata = result.metadata }
    if (result.data)     { RESULT.data     = result.data }
    return RESULT
  },
  errorFormat: (result) => {
    return {
      status  : result.status,
      message : result.message,
      errors  : result.errors
    }
  }
}, insacConfig.RESPONSE || {})

// |=============================================================|
// |---------- CONFIGURACIÓN DEL APIDOC -------------------------|
// |=============================================================|

const PROTOCOL = (config.SERVER.https === true) ? 'https' : 'http'
const DOMAIN   = 'localhost'

exports.APIDOC = _.merge({
  url      : `${PROTOCOL}://${DOMAIN}:${config.SERVER.port}`,
  template : {
    withGenerator : false,
    withCompare   : false,
    forceLanguage : 'es'
  },
  header : { title: 'HEADER', filename: 'HEADER.md' },
  footer : { title: 'FOOTER', filename: 'FOOTER.md' }
}, insacConfig.APIDOC || {})
