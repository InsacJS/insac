'use strict'
/** @ignore */ const ResponseError = require('./ResponseError')

/**
* Este error ocurre si se intenta acceder a un recurso que requiere una clave de acceso
* Tambien es devuelto cuando las credenciales para autentiarse son incorrectas.
*/
class UnauthorizedError extends ResponseError {

  /**
  * Crea una instancia de la clase UnauthorizedError.
  * @param {String} message Mensaje que describe el error.
  */
  constructor(message = UnauthorizedError.MESSAGE) {
    super(401, message)
  }
}

UnauthorizedError.TYPE = 'Unauthorized'
UnauthorizedError.MESSAGE = 'Acceso no autorizado'

module.exports = UnauthorizedError
