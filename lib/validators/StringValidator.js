'use strict'
/** @ignore */ const validator = require('validator')
/** @ignore */ const Validator = require('./Validator')

/**
* Describe un validador para el tipo de dato STRING
* @extends {Validator}
*/
class StringValidator extends Validator {

  /**
  * Crea una instancia de la clase StringValidator.
  * @param {Number} [min=1] Longitud mpinima de caracteres.
  * @param {Number} [max=255] Longitud mpinima de caracteres.
  */
  constructor(min = 1, max = 255) {
    super('STRING', [min, max])

    /**
    * Longitud mínima de caracterres
    * @type {Number}
    */
    this.min = min

    /**
    * Longitud máxima de caracterres
    * @type {Number}
    */
    this.max = max
  }

  validate(str) {
    let options = { min:this.min, max:this.max }
    if ((typeof str == 'string') && validator.isLength(str, options)) {
      return { isValid:true, value:str }
    }
    return { isValid:false, msg:`Debe ser una cadena de texto entre ${this.min} y ${this.max} caracteres` }
  }

}

module.exports = StringValidator
