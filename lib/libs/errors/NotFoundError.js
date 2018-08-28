/** @ignore */ const ResponseError = require('../ResponseError')

/**
* Clase NotFoundError
*/
class NotFoundError extends ResponseError {
  /**
  * Crea una instancia.
  * @param {String} msg - Descripción específica del error.
  *                       También puede ser un objeto ó incluso un array de objetos que tengan
  *                       las propiedades <code>msg</code> y <code>dev</code>.
  */
  constructor (msg = NotFoundError.MSG) {
    const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
    errors.forEach(err => {
      err.msg = err.msg || NotFoundError.MSG
      err.dev = err.dev || null
    })
    super(
      NotFoundError.TYPE,
      NotFoundError.CODE,
      NotFoundError.MESSAGE,
      errors
    )
  }
}

NotFoundError.TYPE    = 'NOT_FOUND'
NotFoundError.CODE    = 404
NotFoundError.MESSAGE = 'Recurso no disponible'
NotFoundError.MSG     = 'El servidor no puede encontrar el recurso solicitado.'

/**
* @ignore
* Crea un objeto de tipo error sin invocar al constructor.
* Esto es para mantener en la cima del stack el punto exacto donde ocurrio el error.
* @param {String} msg - Descripción específica del error.
*                       También puede ser un objeto ó incluso un array de objetos que tengan
*                       las propiedades <code>msg</code> y <code>dev</code>.
* @return {Object}
*/
NotFoundError.create = (msg = NotFoundError.MSG) => {
  const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
  errors.forEach(err => {
    err.msg = err.msg || NotFoundError.MSG
    err.dev = err.dev || null
  })
  return ResponseError.create(
    NotFoundError.TYPE,
    NotFoundError.CODE,
    NotFoundError.MESSAGE,
    errors
  )
}

module.exports = NotFoundError
