'use strict'
/** @ignore */ const ResponseError = require('./ResponseError')

/**
* Este error ocurre en el lado del servidor.
* No debería ocurrir
*/
class InternalServerError extends ResponseError {

  /**
  * Crea una instancia de la clase InternalServerError.
  * @param {String} message Mensaje que describe el error.
  */
  constructor(message = InternalServerError.MESSAGE) {
    super(500, message)
  }
}

InternalServerError.TYPE = 'Internal Server Error'
InternalServerError.MESSAGE = 'Error del servidor'

module.exports = InternalServerError
