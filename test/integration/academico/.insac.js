const path = require('path')

exports.PATH = {
  project : __dirname,
  modules : path.resolve(__dirname, './src/modules'),
  config  : path.resolve(__dirname, './src/config'),
  hooks   : path.resolve(__dirname, './src/hooks'),
  logs    : path.resolve(__dirname, './logs'),
  public  : path.resolve(__dirname, './public'),
  apidoc  : path.resolve(__dirname, './public/apidoc')
}

const PRODUCTION_ENABLED  = process.env.NODE_ENV === 'production'

exports.RESPONSE = {
  successFormat: (result) => {
    const RESULT = {
      estado  : result.status,
      mensaje : result.message
    }
    if (result.metadata) { RESULT.metadatos = result.metadata }
    if (result.data)     { RESULT.datos     = result.data }
    return RESULT
  },
  errorFormat: (result) => {
    const errores = []
    result.errors.forEach(err => {
      if (PRODUCTION_ENABLED) { delete err.dev }
      errores.push({ ruta: err.path, msg: err.msg, info: err.dev })
    })
    return {
      estado  : result.status,
      mensaje : result.message,
      errores  : result.errors
    }
  }
}

exports.APIDOC = {
  title    : 'Apidoc',
  name     : 'Documentación Personalizada',
  version  : '1.0.0',
  template : {
    withGenerator : false,
    withCompare   : true,
    forceLanguage : 'es'
  },
  header : { title: 'INTRODUCCIÓN',  filename: 'HEADER.md' },
  footer : { title: 'INSTRUCCIONES', filename: 'FOOTER.md' }
}

exports.LOGGER = {
  console: {
    enabled   : false,
    timestamp : true,
    reqId     : true
  },
  file: {
    maxsize  : 5242880,
    maxFiles : 5,
    levels   : ['error', 'warn', 'info', 'trace', 'notice']
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
}
