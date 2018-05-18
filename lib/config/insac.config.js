const _      = require('lodash')
const util   = require('../tools/util')
const config = require('./app.config.js')

let insacConfig = {}
util.find(process.cwd(), '.insac.js', ({ filePath }) => { insacConfig = require(filePath) })

// |=============================================================|
// |--------- CONFIGURACIÓN DE LA RUTA DE LAS CARPETAS ----------|
// |=============================================================|

exports.PATH = _.merge({
  modules : process.cwd(),
  config  : process.cwd(),
  hooks   : process.cwd()
}, insacConfig.PATH || {})

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
  title    : 'Apidoc',
  name     : 'Documentación',
  version  : '1.0.0',
  url      : `${PROTOCOL}://${DOMAIN}:${config.SERVER.port}`,
  template : {
    withGenerator : false,
    withCompare   : false,
    forceLanguage : 'es'
  },
  header : null,
  footer : { title: 'INSTRUCCIONES', filename: 'FOOTER.md' }
}, insacConfig.APIDOC || {})
