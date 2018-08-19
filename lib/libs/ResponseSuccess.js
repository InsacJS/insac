/**
* Clase ResponseSuccess
*/
class ResponseSuccess {
  /**
  * Crea una instancia.
  * @param {String} type       - Tipo de respuesta.
  * @param {Number} code       - Número asiciado al tipo de respuesta.
  * @param {String} message    - Descripción general de la respuesta.
  * @param {Object} data       - Datos.
  * @param {Object} [metadata] - Metadatos.
  */
  constructor (type, code, message, data, metadata) {
    /**
    * Nombre del objeto
    * @type {String}
    */
    this.name = ResponseSuccess.NAME

    /**
    * Estado de la respuesta.
    * @type {String}
    */
    this.status = ResponseSuccess.STATUS

    /**
    * Tipo de respuesta
    * @type {String}
    */
    this.type = type

    /**
    * Código asociado al tipo de respuesta.
    * @type {Number}
    */
    this.code = code

    /**
    * Mensaje espećifico de la respuesta.
    * @type {String}
    */
    this.message = message

    /**
    * Objeto con datos.
    * @type {Object}
    */
    this.data = data

    /**
    * Objeto con metadatos.
    * @type {Object}
    */
    this.metadata = metadata
  }
}

ResponseSuccess.NAME   = 'ResponseHandlerSuccess'
ResponseSuccess.STATUS = 'success'

/**
* @ignore
* Crea un objeto ResponseError sin invocar un constructor.
* @param {String} type       - Tipo de respuesta.
* @param {Number} code       - Número asiciado al tipo de respuesta.
* @param {String} message    - Descripción general de la respuesta.
* @param {Object} data       - Datos.
* @param {Object} [metadata] - Metadatos.
* @return {ResponseSuccess}
*/
ResponseSuccess.create = (type, code, message, data, metadata) => {
  return {
    name     : ResponseSuccess.NAME,
    status   : ResponseSuccess.STATUS,
    type     : type,
    code     : code,
    message  : message,
    data     : data,
    metadata : metadata
  }
}

module.exports = ResponseSuccess
