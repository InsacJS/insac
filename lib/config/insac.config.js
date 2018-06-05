const _      = require('lodash')
const path   = require('path')
const util   = require('../tools/util')
const config = require('./app.config.js')

let insacConfig = {}
util.find(process.cwd(), '.insac.js', ({ filePath }) => { insacConfig = require(filePath) })

const PRODUCTION_ENABLED  = config.SERVER.env === 'production'
const DEVELOPMENT_ENABLED = config.SERVER.env === 'development'

// |=============================================================|
// |--------- CONFIGURACIÓN DE LA RUTA DE LAS CARPETAS ----------|
// |=============================================================|

exports.PATH = _.merge({
  modules : process.cwd(),
  config  : process.cwd(),
  hooks   : process.cwd(),
  logs    : path.resolve(process.cwd(), 'logs')
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
    result.errors.forEach(err => { if (PRODUCTION_ENABLED) delete err.dev })
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
    withCompare   : true,
    forceLanguage : 'es'
  },
  header : null,
  footer : { title: 'INSTRUCCIONES', filename: 'FOOTER.md' }
}, insacConfig.APIDOC || {})

// |=============================================================|
// |---------- CONFIGURACIÓN DE LOGGER --------------------------|
// |=============================================================|

exports.LOGGER = _.merge({
  console: {
    enabled   : DEVELOPMENT_ENABLED,
    timestamp : true,
    reqId     : true
  },
  file: {
    maxsize  : 5242880,
    maxFiles : 5,
    levels   : ['error', 'warn']
  },
  include: {
    request: {
      path    : true,
      query   : true,
      body    : true,
      headers : false
    },
    response: {
      data : false,
      code : true
    },
    error400 : true,
    error500 : true,
    session  : true
  }
}, insacConfig.LOGGER || {})
