'use strict'
/** @ignore */ const StringValidator = require('../validators/StringValidator')
/** @ignore */ const IntegerValidator = require('../validators/IntegerValidator')

/**
* Contiene varias funciones que permiten crear diferentes tipos de datos
*/
class Validators {

  /**
  * Devuelve un validador especialmente diseñado para el tipo de dato STRING.
  * @param {Number} [min=1] Longitud minima de caracteres.
  * @param {Number} [max=255] Longitud máxima de caracteres.
  * @return {StringValidator} Instancia de la clase StringValidator.
  */
  static STRING(min = 1, max = 255) {
    return new StringValidator(min, max)
  }

  /**
  * Devuelve un validador especialmente diseñado para el tipo de dato INTEGER.
  * @param {Number} [min=1] Valor mínimo admitido.
  * @param {Number} [max=2147483647] Valor máximo admitido.
  * @return {IntegerValidator} instancia de la clase IntegerValidator.
  */
  static INTEGER(min = 1, max = 2147483647) {
    return new IntegerValidator(min, max)
  }

}

module.exports = Validators
