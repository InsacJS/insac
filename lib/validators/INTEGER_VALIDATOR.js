'use strict'
/** @ignore */ const Validator = require('./Validator')

/**
* Describe un validador para el tipo de dato INTEGER
* @extends {Validator}
*/
class INTEGER_VALIDATOR extends Validator {

  /**
  * Crea una instancia de la clase INTEGER_VALIDATOR.
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
  
}

module.exports = INTEGER_VALIDATOR
