/** @ignore */const { Response } = require('response-handler')

/**
* Módulo encargado de configurar el formato de las respuestas.
* @module
*/
module.exports = (app) => {
  Response.successFormat = (result) => {
    const RESULT = {
      status  : result.status,
      message : result.message
    }
    if (result.metadata) { RESULT.metadata = result.metadata }
    if (result.data)     { RESULT.data     = result.data }
    return RESULT
  }

  Response.errorFormat = (result) => {
    return {
      status  : result.status,
      message : result.message,
      errors  : result.errors
    }
  }
}
