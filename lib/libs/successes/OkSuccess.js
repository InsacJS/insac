/** @ignore */ const ResponseSuccess = require('../ResponseSuccess')

/**
* Clase OkSuccess
*/
class OkSuccess extends ResponseSuccess {
  /**
  * Crea una instancia.
  * @param {Object} [data]     - Datos.
  * @param {String} [message]  - Descripción general de la respuesta.
  * @param {Object} [metadata] - Metadatos.
  */
  constructor (data = null, message = OkSuccess.MESSAGE, metadata = null) {
    super(
      OkSuccess.TYPE,
      OkSuccess.CODE,
      message,
      data,
      metadata
    )
  }
}

OkSuccess.TYPE    = 'OK'
OkSuccess.CODE    = 200
OkSuccess.MESSAGE = 'Tarea completada exitosamente.'

/**
* @ignore
* Crea un objeto OkSuccess sin invocar un constructor.
* @param {Object} [data]     - Datos.
* @param {String} [message]  - Descripción general de la respuesta.
* @param {Object} [metadata] - Metadatos.
* @return {OkSuccess}
*/
OkSuccess.create = (data = null, message = OkSuccess.MESSAGE, metadata = null) => {
  return ResponseSuccess.create(
    OkSuccess.TYPE,
    OkSuccess.CODE,
    message,
    data,
    metadata
  )
}

module.exports = OkSuccess
