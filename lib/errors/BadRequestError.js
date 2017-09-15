'use strict'
/** @ignore */ const ResponseError = require('./ResponseError')

/**
* Este error ocurre cuando existe un error en el lado del cliente.
* Por lo general, es un error de sintaxis.
*/
class BadRequestError extends ResponseError {

  /**
  * Crea una instancia de la clase BadRequestError.
  * @param {String} message Mensaje que describe el error.
  */
  constructor(message = BadRequestError.MESSAGE) {
    super(400, message)
  }
}

BadRequestError.TYPE = 'Bad Request'
BadRequestError.MESSAGE = 'Error en la petición'

module.exports = BadRequestError
