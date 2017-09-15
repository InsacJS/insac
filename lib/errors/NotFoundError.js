'use strict'
/** @ignore */ const ResponseError = require('./ResponseError')

/**
* Este error ocurre cuando no el recurso solicitado no existe
*/
class NotFoundError extends ResponseError {

  /**
  * Crea una instancia de la clase NotFoundError.
  * @param {String} message Mensaje que describe el error.
  */
  constructor(message = NotFoundError.MESSAGE) {
    super(404, message)
  }
}

NotFoundError.TYPE = 'Not Found'
NotFoundError.MESSAGE = 'No existe el recurso solicitado'

module.exports = NotFoundError
