/** @ignore */ const ResponseError = require('../ResponseError')

/**
* Clase BadRequestError
*/
class BadRequestError extends ResponseError {
  /**
  * Crea una instancia.
  * @param {String} msg - Descripción específica del error.
  *                       También puede ser un objeto ó incluso un array de objetos que tengan
  *                       las propiedades <code>msg</code> y <code>dev</code>.
  */
  constructor (msg = BadRequestError.MSG) {
    const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
    errors.forEach(err => {
      err.msg = err.msg || BadRequestError.MSG
      err.dev = err.dev || null
    })
    super(
      BadRequestError.TYPE,
      BadRequestError.CODE,
      BadRequestError.MESSAGE,
      errors
    )
  }
}

BadRequestError.TYPE    = 'BAD_REQUEST'
BadRequestError.CODE    = 400
BadRequestError.MESSAGE = 'Petición incorrecta'
BadRequestError.MSG     = 'Hubo un error al procesar su solicitud, revise el formato en el envío de datos e inténtelo nuevamente.'

/**
* @ignore
* Crea un objeto de tipo error sin invocar al constructor.
* Esto es para mantener en la cima del stack el punto exacto donde ocurrio el error.
* @param {String} msg - Descripción específica del error.
*                       También puede ser un objeto ó incluso un array de objetos que tengan
*                       las propiedades <code>msg</code> y <code>dev</code>.
* @return {Object}
*/
BadRequestError.create = (msg = BadRequestError.MSG) => {
  const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
  errors.forEach(err => {
    err.msg = err.msg || BadRequestError.MSG
    err.dev = err.dev || null
  })
  return ResponseError.create(
    BadRequestError.TYPE,
    BadRequestError.CODE,
    BadRequestError.MESSAGE,
    errors
  )
}

module.exports = BadRequestError
