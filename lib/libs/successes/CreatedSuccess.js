/** @ignore */ const ResponseSuccess = require('../ResponseSuccess')

/**
* Clase CreatedSuccess
*/
class CreatedSuccess extends ResponseSuccess {
  /**
  * Crea una instancia.
  * @param {Object} [data]     - Datos.
  * @param {String} [message]  - Descripción general de la respuesta.
  * @param {Object} [metadata] - Metadatos.
  */
  constructor (data = null, message = CreatedSuccess.MESSAGE, metadata = null) {
    super(
      CreatedSuccess.TYPE,
      CreatedSuccess.CODE,
      message,
      data,
      metadata
    )
  }
}

CreatedSuccess.TYPE    = 'CREATED'
CreatedSuccess.CODE    = 201
CreatedSuccess.MESSAGE = 'Recurso creado exitosamente.'

/**
* @ignore
* Crea un objeto CreatedSuccess sin invocar un constructor.
* @param {Object} [data]     - Datos.
* @param {String} [message]  - Descripción general de la respuesta.
* @param {Object} [metadata] - Metadatos.
* @return {OkSuccess}
*/
CreatedSuccess.create = (data = null, message = CreatedSuccess.MESSAGE, metadata = null) => {
  return ResponseSuccess.create(
    CreatedSuccess.TYPE,
    CreatedSuccess.CODE,
    message,
    data,
    metadata
  )
}

module.exports = CreatedSuccess
