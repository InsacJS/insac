'use strict'

/**
* Describe el tipo de error de una petición.
*/
class ResponseError {

  /**
  * Crea una instancia de la clase ResponseError.
  * @param {Number} code Código de respuesta.
  * @param {String} msg Mensaje que describe detalles del error.
  */
  constructor(code, msg) {
    /**
    * Código de error
    * @type {Number}
    */
    this.code = code

    /**
    * Mensaje de error
    * @type {String}
    */
    this.msg = msg
  }

}

module.exports = {
  ResponseError
}
