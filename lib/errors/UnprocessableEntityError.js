'use strict'
/** @ignore */ const ResponseError = require('./ResponseError')

/**
* Este error ocurre cuando los datos enviados son incorrectos o
* no cumple con algunas condiciones impuestas con el recurso.
*/
class UnprocessableEntityError extends ResponseError {

  /**
  * Crea una instancia de la clase UnprocessableEntityError.
  * @param {String} message Mensaje que describe el error.
  */
  constructor(message = UnprocessableEntityError.MESSAGE) {
    super(422, message)
  }
}

UnprocessableEntityError.TYPE = 'Unprocessable Entity'
UnprocessableEntityError.MESSAGE = 'Algunos datos no son válidos'

module.exports = UnprocessableEntityError
