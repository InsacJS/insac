/** @ignore */ const ResponseError = require('../ResponseError')

/**
* Clase InvalidTokenError
*/
class InvalidTokenError extends ResponseError {
  /**
  * Crea una instancia.
  * @param {String} msg - Descripción específica del error.
  *                       También puede ser un objeto ó incluso un array de objetos que tengan
  *                       las propiedades <code>msg</code> y <code>dev</code>.
  */
  constructor (msg = InvalidTokenError.MSG) {
    const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
    errors.forEach(err => {
      err.msg = err.msg || InvalidTokenError.MSG
      err.dev = err.dev || null
    })
    super(
      InvalidTokenError.TYPE,
      InvalidTokenError.CODE,
      InvalidTokenError.MESSAGE,
      errors
    )
  }
}

InvalidTokenError.TYPE    = 'INVALID_TOKEN'
InvalidTokenError.CODE    = 498
InvalidTokenError.MESSAGE = 'Token inválido'
InvalidTokenError.MSG     = 'La sesión ha expirado.'

/**
* @ignore
* Crea un objeto de tipo error sin invocar al constructor.
* Esto es para mantener en la cima del stack el punto exacto donde ocurrio el error.
* @param {String} msg - Descripción específica del error.
*                       También puede ser un objeto ó incluso un array de objetos que tengan
*                       las propiedades <code>msg</code> y <code>dev</code>.
* @return {Object}
*/
InvalidTokenError.create = (msg = InvalidTokenError.MSG) => {
  const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
  errors.forEach(err => {
    err.msg = err.msg || InvalidTokenError.MSG
    err.dev = err.dev || null
  })
  return ResponseError.create(
    InvalidTokenError.TYPE,
    InvalidTokenError.CODE,
    InvalidTokenError.MESSAGE,
    errors
  )
}

module.exports = InvalidTokenError
