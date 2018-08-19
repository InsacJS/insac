/** @ignore */ const ResponseError = require('../ResponseError')

/**
* Clase ConflictError
*/
class ConflictError extends ResponseError {
  /**
  * Crea una instancia.
  * @param {String} msg - Descripción específica del error.
  *                       También puede ser un objeto ó incluso un array de objetos que tengan
  *                       las propieades <code>msg</code> y <code>dev</code>.
  */
  constructor (msg = ConflictError.MSG) {
    const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
    errors.forEach(err => {
      err.msg = err.msg || ConflictError.MSG
      err.dev = err.dev || null
    })
    super(
      ConflictError.TYPE,
      ConflictError.CODE,
      ConflictError.MESSAGE,
      errors
    )
  }
}

ConflictError.TYPE    = 'CONFLICT'
ConflictError.CODE    = 409
ConflictError.MESSAGE = 'Conflicto.'
ConflictError.MSG     = 'Hubo un error durante el proceso, inténtelo nuevamente.'

/**
* @ignore
* Crea un objeto de tipo error sin invocar al constructor.
* Esto es para mantener en la cima del stack el punto exacto donde ocurrio el error.
* @param {String} msg - Descripción específica del error.
*                       También puede ser un objeto ó incluso un array de objetos que tengan
*                       las propieades <code>msg</code> y <code>dev</code>.
* @return {Object}
*/
ConflictError.create = (msg = ConflictError.MSG) => {
  const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
  errors.forEach(err => {
    err.msg = err.msg || ConflictError.MSG
    err.dev = err.dev || null
  })
  return ResponseError.create(
    ConflictError.TYPE,
    ConflictError.CODE,
    ConflictError.MESSAGE,
    errors
  )
}

module.exports = ConflictError
