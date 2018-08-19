/** @ignore */ const PRODUCTION_ENABLED  = process.env.NODE_ENV === 'production'

/**
* Configuración del formato de respuestas de las peticiones.
* @type {Object}
* @param {Boolean}  all200        - Indica si todas las peticiones se devolverán con el cósigo 200 OK.
* @param {Function} successFormat - Formato de las peticiones finalizadas exitosamente.
* @param {Function} errorFormat   - Formato de las peticiones finalizadas con error.
*/
const RESPONSE = {
  all200: true,

  successFormat: (result) => {
    const RESULT = {
      status  : result.status,
      code    : result.code,
      message : result.message
    }
    if (result.metadata) { RESULT.metadata = result.metadata }
    if (result.data)     { RESULT.data     = result.data }
    return RESULT
  },

  errorFormat: (result) => {
    result.errors.forEach(err => { if (PRODUCTION_ENABLED || !err.dev) delete err.dev })
    return {
      status  : result.status,
      code    : result.code,
      message : result.message,
      errors  : result.errors
    }
  }
}

module.exports = RESPONSE
