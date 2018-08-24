/**
* Clase ResponseError
*/
class ResponseError extends Error {
  /**
  * Crea una instancia.
  * @param {String}   type     - Tipo de respuesta.
  * @param {Number}   code     - Número asociado al tipo de respuesta.
  * @param {String}   message  - Descripción general de la respuesta.
  * @param {Object[]} errors   - Lista de errores.
  * @param {Error}    [parent] - Error padre.
  */
  constructor (type, code, message, errors, parent) {
    super(message)
    /**
    * Nombre del objeto
    * @type {String}
    */
    this.name = ResponseError.NAME

    /**
    * Estado de la respuesta.
    * @type {String}
    */
    this.status = ResponseError.STATUS

    /**
    * Tipo de error
    * @type {String}
    */
    this.type = type

    /**
    * Código asociado al tipo de error.
    * @type {Number}
    */
    this.code = code

    /**
    * Mensaje general del error.
    * @type {String}
    */
    this.message = message

    /**
    * Lista de errores.
    * @type {Object[]}
    */
    this.errors = errors

    /**
    * Error padre.
    * @type {Error}
    */
    this.parent = parent
  }
}

ResponseError.NAME   = 'ResponseHandlerError'
ResponseError.STATUS = 'error'

/**
* @ignore
* Crea un objeto ResponseError sin invocar un constructor.
* Esto es para mantener en la cima del stack el punto exacto donde ocurrio el error.
* @param {String}   type     - Tipo de respuesta.
* @param {Number}   code     - Número asociado al tipo de respuesta.
* @param {String}   message  - Descripción general de la respuesta.
* @param {Object[]} errors   - Lista de errores.
* @param {Error}    [parent] - Error padre.
* @return {ResponseError}
*/
ResponseError.create = (type, code, message, errors, parent) => {
  return {
    name    : ResponseError.NAME,
    status  : ResponseError.STATUS,
    type    : type,
    code    : code,
    message : message,
    errors  : errors,
    parent  : parent
  }
}

module.exports = ResponseError
