/** @ignore */ const ResponseError = require('../ResponseError')

/**
* Clase ForbiddenError
*/
class ForbiddenError extends ResponseError {
  /**
  * Crea una instancia.
  * @param {String} msg - Descripción específica del error.
  *                       También puede ser un objeto ó incluso un array de objetos que tengan
  *                       las propiedades <code>msg</code> y <code>dev</code>.
  */
  constructor (msg = ForbiddenError.MSG) {
    const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
    errors.forEach(err => {
      err.msg = err.msg || ForbiddenError.MSG
      err.dev = err.dev || null
    })
    super(
      ForbiddenError.TYPE,
      ForbiddenError.CODE,
      ForbiddenError.MESSAGE,
      errors
    )
  }
}

ForbiddenError.TYPE    = 'FORBIDDEN'
ForbiddenError.CODE    = 403
ForbiddenError.MESSAGE = 'Acceso denegado'
ForbiddenError.MSG     = 'No cuenta con los privilegios suficientes para acceder al recurso.'

/**
* @ignore
* Crea un objeto de tipo error sin invocar al constructor.
* Esto es para mantener en la cima del stack el punto exacto donde ocurrio el error.
* @param {String} msg - Descripción específica del error.
*                       También puede ser un objeto ó incluso un array de objetos que tengan
*                       las propiedades <code>msg</code> y <code>dev</code>.
* @return {Object}
*/
ForbiddenError.create = (msg = ForbiddenError.MSG) => {
  const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
  errors.forEach(err => {
    err.msg = err.msg || ForbiddenError.MSG
    err.dev = err.dev || null
  })
  return ResponseError.create(
    ForbiddenError.TYPE,
    ForbiddenError.CODE,
    ForbiddenError.MESSAGE,
    errors
  )
}

module.exports = ForbiddenError
