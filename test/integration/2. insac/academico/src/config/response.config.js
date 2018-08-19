const PRODUCTION_ENABLED  = process.env.NODE_ENV === 'production'

const RESPONSE = {
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
      errores : result.errors
    }
  }
}

module.exports = RESPONSE
