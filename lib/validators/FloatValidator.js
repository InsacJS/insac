'use strict'
/** @ignore */ const validator = require('validator')
/** @ignore */ const Validator = require('./Validator')

/**
* Describe un validador para el tipo de dato FLOAT.
* @extends {Validator}
*/
class FloatValidator extends Validator {

  /**
  * Crea una instancia de la clase FloatValidator.
  * FLOAT:  Simple presición 6 dígitos decimales. -1E+308 to 1E+308  (1e-307 to 1e+308)
  * DOUBLE: Doble presición 15 dígitos decimales. -1E+308 to 1E+308  (1e-307 to 1e+308)
  * @param {Number} [min=0] Valor mínimo admitido.
  * @param {Number} [max=1E+308] Valor máximo admitido.
  */
  constructor(min = 0, max = 1E+308) {
    super('FLOAT', [min, max])

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
    if (validator.isFloat(str + '', options)) {
      return { isValid:true, value:parseFloat(str), message:'El campo es válido' }
    }
    return { isValid:false, value:str, message:`Debe ser un número (Float) entre ${this.min} y ${this.max} inclusive` }
  }

  /**
  * Devuelve el tipo de dato para la documentación
  * @return {String}
  */
  apidocType() {
    return `Number{${this.min} - ${this.max} (Float)}`
  }

}

module.exports = FloatValidator
