'use strict'
/** @ignore */ const ResponseError = require('./ResponseError')

/**
* Este error ocurre cuando se tiene una clave de acceso,
* pero no cuenta con los privilegios suficientes para acceder al recurso.
*/
class ForbiddenError extends ResponseError {

  /**
  * Crea una instancia de la clase ForbiddenError.
  * @param {String} message Mensaje que describe el error.
  */
  constructor(message = ForbiddenError.MESSAGE) {
    super(403, message)
  }
}

ForbiddenError.TYPE = 'Forbidden'
ForbiddenError.MESSAGE = 'Acceso denegado'

module.exports = ForbiddenError
