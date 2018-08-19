/** @ignore */ const ResponseError = require('../ResponseError')

/**
* Clase InternalServerError
*/
class InternalServerError extends ResponseError {
  /**
  * Crea una instancia.
  * @param {Object} err - Error.
  * @param {String} msg - Mensaje de error personalizado.
  */
  constructor (err, msg = InternalServerError.MSG) {
    super(
      InternalServerError.TYPE,
      InternalServerError.CODE,
      InternalServerError.MESSAGE,
      [{ msg, dev: err ? err.toString() : null }],
      err
    )
  }
}

InternalServerError.TYPE    = 'INTERNAL_SERVER_ERROR'
InternalServerError.CODE    = 500
InternalServerError.MESSAGE = 'Error interno'
InternalServerError.MSG     = 'Hubo un error inesperado, inténtelo mas tarde.'

/**
* @ignore
* Crea un objeto de tipo error sin invocar al constructor.
* Esto es para mantener en la cima del stack el punto exacto donde ocurrio el error.
* @param {Object} err - Error.
* @param {String} msg - Mensaje de error personalizado.
* @return {Object}
*/
InternalServerError.create = (err, msg = InternalServerError.MSG) => {
  return ResponseError.create(
    InternalServerError.TYPE,
    InternalServerError.CODE,
    InternalServerError.MESSAGE,
    [{ msg, dev: err ? err.toString() : null }],
    err
  )
}

module.exports = InternalServerError
