'use strict'
/** @ignore */ const validator = require('validator')
/** @ignore */ const Validator = require('./Validator')

/**
* Describe un validador para validar direcciones de correo electrónico.
* @extends {Validator}
*/
class EmailValidator extends Validator {

  /**
  * Crea una instancia de la clase EmailValidator.
  * @param {Number} [min=1] Longitud mpinima de caracteres.
  * @param {Number} [max=255] Longitud mpinima de caracteres.
  */
  constructor(min = 1, max = 255) {
    super('EMAIL', [min, max])

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

  /**
  * Parsea una cadena de texto (dato de entrada), y devuelve un objeto con
  * algunas propiedades que indican el resultado de la validación.
  * @param {String} str Dato de entrada a parsear y validar.
  * @return {Object} result Resultado del parseo y la validación. Devuelve
  * las propiedades isValid, value y message.
  * @override
  */
  validate(str) {
    let options = { min:this.min, max:this.max }
    if ((typeof str == 'string') && validator.isLength(str, options)) {
      if (validator.isEmail(str)) {
        return { isValid:true, value:str, message:'El campo es válido' }
      }
      return { isValid:false, value:str, message:`Debe ser una dirección de email válida` }
    }
    return { isValid:false, value:str, message:`Debe ser una cadena de texto entre ${this.min} y ${this.max} caracteres` }
  }

  /**
  * Devuelve el tipo de dato para la documentación
  * @return {String}
  */
  apidocType() {
    return `String{${this.min}..${this.max}}`
  }

}

module.exports = EmailValidator