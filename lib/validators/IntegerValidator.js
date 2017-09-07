'use strict'
/** @ignore */ const validator = require('validator')
/** @ignore */ const Validator = require('./Validator')

/**
* Describe un validador para el tipo de dato INTEGER
* @extends {Validator}
*/
class IntegerValidator extends Validator {

  /**
  * Crea una instancia de la clase IntegerValidator.
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

  validate(str) {
    str = str + ""
    let options = { min:this.min, max:this.max }
    if (validator.isInt(str, options)) {
      return { isValid:true, value:parseInt(str) }
    }
    return { isValid:false, msg:`Debe ser un número entero, entre ${this.min} y ${this.max} inclusive` }
  }

}

module.exports = IntegerValidator
