/** @ignore */ const ResponseError = require('../ResponseError')

/**
* Clase UnauthorizedError
*/
class UnauthorizedError extends ResponseError {
  /**
  * Crea una instancia.
  * @param {String} msg - Descripción específica del error.
  *                       También puede ser un objeto ó incluso un array de objetos que tengan
  *                       las propiedades <code>msg</code> y <code>dev</code>.
  */
  constructor (msg = UnauthorizedError.MSG) {
    const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
    errors.forEach(err => {
      err.msg = err.msg || UnauthorizedError.MSG
      err.dev = err.dev || null
    })
    super(
      UnauthorizedError.TYPE,
      UnauthorizedError.CODE,
      UnauthorizedError.MESSAGE,
      errors
    )
  }
}

UnauthorizedError.TYPE    = 'UNAUTHORIZED'
UnauthorizedError.CODE    = 401
UnauthorizedError.MESSAGE = 'Acceso no autorizado'
UnauthorizedError.MSG     = 'Debe autenticarse para acceder al recurso.'

/**
* @ignore
* Crea un objeto de tipo error sin invocar al constructor.
* Esto es para mantener en la cima del stack el punto exacto donde ocurrio el error.
* @param {String} msg - Descripción específica del error.
*                       También puede ser un objeto ó incluso un array de objetos que tengan
*                       las propiedades <code>msg</code> y <code>dev</code>.
* @return {Object}
*/
UnauthorizedError.create = (msg = UnauthorizedError.MSG) => {
  const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
  errors.forEach(err => {
    err.msg = err.msg || UnauthorizedError.MSG
    err.dev = err.dev || null
  })
  return ResponseError.create(
    UnauthorizedError.TYPE,
    UnauthorizedError.CODE,
    UnauthorizedError.MESSAGE,
    errors
  )
}

module.exports = UnauthorizedError
