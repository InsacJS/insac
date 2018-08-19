/** @ignore */ const ResponseError = require('../ResponseError')

/**
* Clase PreconditionFailedError
*/
class PreconditionFailedError extends ResponseError {
  /**
  * Crea una instancia.
  * @param {String} msg - Descripción específica del error.
  *                       También puede ser un objeto ó incluso un array de objetos que tengan
  *                       las propieades <code>msg</code> y <code>dev</code>.
  */
  constructor (msg = PreconditionFailedError.MSG) {
    const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
    errors.forEach(err => {
      err.msg = err.msg || PreconditionFailedError.MSG
      err.dev = err.dev || null
    })
    super(
      PreconditionFailedError.TYPE,
      PreconditionFailedError.CODE,
      PreconditionFailedError.MESSAGE,
      errors
    )
  }
}

PreconditionFailedError.TYPE    = 'PRECONDITION_FAILED'
PreconditionFailedError.CODE    = 412
PreconditionFailedError.MESSAGE = 'Condición insuficiente'
PreconditionFailedError.MSG     = 'No se cumple con algunas condiciones que son necesarias para completar la tarea.'

/**
* @ignore
* Crea un objeto de tipo error sin invocar al constructor.
* Esto es para mantener en la cima del stack el punto exacto donde ocurrio el error.
* @param {String} msg - Descripción específica del error.
*                       También puede ser un objeto ó incluso un array de objetos que tengan
*                       las propieades <code>msg</code> y <code>dev</code>.
* @return {Object}
*/
PreconditionFailedError.create = (msg = PreconditionFailedError.MSG) => {
  const errors = Array.isArray(msg) ? msg : (typeof msg === 'object' ? [msg] : [{ msg }])
  errors.forEach(err => {
    err.msg = err.msg || PreconditionFailedError.MSG
    err.dev = err.dev || null
  })
  return ResponseError.create(
    PreconditionFailedError.TYPE,
    PreconditionFailedError.CODE,
    PreconditionFailedError.MESSAGE,
    errors
  )
}

module.exports = PreconditionFailedError
