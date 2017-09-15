'use stric'

/**
* Describe un tipo de error
*/
class ResponseError extends Error {

  /**
  * Crea una instancia de la clase ResponseError.
  * @param {Number} code Código de estado del error.
  * @param {String} message Mensaje que describe el error.
  */
  constructor(code, message) {
    super(message)

    /**
    * Código de estado.
    * @type {Number}
    */
    this.code = code
  }

}

module.exports = ResponseError
