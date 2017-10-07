'use strict'
/** @ignore */ const validator = require('validator')
/** @ignore */ const Validator = require('./Validator')

/**
* Describe un validador para el tipo de dato INTEGER.
* @extends {Validator}
*/
class IntegerValidator extends Validator {

  /**
  * Crea una instancia de la clase IntegerValidator.
  * INTEGER: -2147483648 to +2147483647
  * @param {Number} [min=1] Valor mínimo admitido.
  * @param {Number} [max=2147483647] Valor máximo admitido.
  */
  constructor(min = 1, max = 2147483647) {
    super('INTEGER', [min, max])

    /**
    * Valor mínimo.
    * @type {Number}
    */
    this.min = min

    /**
    * Valor máximo.
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
    if (validator.isInt(str + '', options)) {
      return { isValid:true, value:parseInt(str), message:'El campo es válido' }
    }
    return { isValid:false, value:str, message:`Debe ser un número (Integer) entre ${this.min} y ${this.max} inclusive` }
  }

  /**
  * Devuelve el tipo de dato para la documentación
  * @return {String}
  */
  apidocType() {
    return `Number{${this.min} - ${this.max} (Integer)}`
  }

}

module.exports = IntegerValidator
