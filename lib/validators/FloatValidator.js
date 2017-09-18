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
  * DOUBLE: 1E-307 to 1E+308, 1 ⇐ p ⇐ 53
  * FLOAT:  -10E38 to 10E38-1, 1 ⇐ p ⇐ 1000, 0 ⇐ s ⇐ p
  * @param {Number} [min=0.0] Valor mínimo admitido.
  * @param {Number} [max=1E+37] Valor máximo admitido.
  */
  constructor(min = 0.0, max = 1E37) {
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
    if (validator.isInt(str + "", options)) {
      return { isValid:true, value:parseFLoat(str), message:'El campo es válido' }
    }
    return { isValid:false, value:str, message:`Debe ser un número decimal, entre ${this.min} y ${this.max} inclusive` }
  }

  /**
  * Devuelve el tipo de dato para la documentación
  * @return {String}
  */
  apidocType() {
    return `Number{${this.min}-${this.max}}`
  }

}

module.exports = FloatValidator
