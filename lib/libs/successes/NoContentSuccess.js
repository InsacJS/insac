/** @ignore */ const ResponseSuccess = require('../ResponseSuccess')

/**
* Clase NoContentSuccess
*/
class NoContentSuccess extends ResponseSuccess {
  /**
  * Crea una instancia.
  * @param {Object} [data]     - Datos.
  * @param {String} [message]  - Descripción general de la respuesta.
  * @param {Object} [metadata] - Metadatos.
  */
  constructor (message = NoContentSuccess.MESSAGE) {
    super(
      NoContentSuccess.TYPE,
      NoContentSuccess.CODE,
      message
    )
  }
}

NoContentSuccess.TYPE    = 'NO CONTENT'
NoContentSuccess.CODE    = 204
NoContentSuccess.MESSAGE = 'Tarea completada exitosamente.'

/**
* @ignore
* Crea un objeto NoContentSuccess sin invocar un constructor.
* @param {Object} [data]     - Datos.
* @param {String} [message]  - Descripción general de la respuesta.
* @param {Object} [metadata] - Metadatos.
* @return {OkSuccess}
*/
NoContentSuccess.create = (message = NoContentSuccess.MESSAGE) => {
  return ResponseSuccess.create(
    NoContentSuccess.TYPE,
    NoContentSuccess.CODE,
    message
  )
}

module.exports = NoContentSuccess
