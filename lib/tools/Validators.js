'use strict'
/** @ignore */ const STRING_VALIDATOR = require('../validators/STRING_VALIDATOR')
/** @ignore */ const INTEGER_VALIDATOR = require('../validators/INTEGER_VALIDATOR')

/**
* Contiene varias funciones que permiten crear diferentes tipos de datos
*/
class Validators {

  /**
  * Devuelve un validador especialmente diseñado para el tipo de dato STRING.
  * @param {Number} [min=1] Longitud minima de caracteres.
  * @param {Number} [max=255] Longitud máxima de caracteres.
  * @return {STRING_VALIDATOR} Instancia de la clase STRING_VALIDATOR.
  */
  static STRING(min = 1, max = 255) {
    return new STRING_VALIDATOR(min, max)
  }

  /**
  * Devuelve un validador especialmente diseñado para el tipo de dato INTEGER.
  * @param {Number} [min=1] Valor mínimo admitido.
  * @param {Number} [max=2147483647] Valor máximo admitido.
  * @return {INTEGER_VALIDATOR} instancia de la clase INTEGER_VALIDATOR.
  */
  static INTEGER(min = 1, max = 2147483647) {
    return new INTEGER_VALIDATOR(min, max)
  }

}

module.exports = Validators
