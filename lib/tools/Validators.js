'use strict'
/** @ignore */ const StringValidator = require('../validators/StringValidator')
/** @ignore */ const IntegerValidator = require('../validators/IntegerValidator')
/** @ignore */ const EmailValidator = require('../validators/EmailValidator')
/** @ignore */ const InValidator = require('../validators/InValidator')
/** @ignore */ const FloatValidator = require('../validators/FloatValidator')

/**
* Contiene varias funciones que permiten crear diferentes tipos de validadores.
*/
class Validators {

  /**
  * Devuelve un validador especialmente diseñado para el tipo de dato STRING.
  * @param {Number} [min=1] Longitud minima de caracteres.
  * @param {Number} [max=255] Longitud máxima de caracteres.
  * @return {StringValidator}
  */
  static STRING(min = 1, max = 255) {
    return new StringValidator(min, max)
  }

  /**
  * Devuelve un validador especialmente diseñado para el tipo de dato INTEGER.
  * @param {Number} [min=1] Valor mínimo admitido.
  * @param {Number} [max=2147483647] Valor máximo admitido.
  * @return {IntegerValidator}
  */
  static INTEGER(min = 1, max = 2147483647) {
    return new IntegerValidator(min, max)
  }

  /**
  * Devuelve un validador especialmente diseñado para validar direcciones de correo electrónico.
  * @return {EmailValidator}
  */
  static EMAIL() {
    return new EmailValidator(1, 255)
  }

  /**
  * Devuelve un validador especialmente diseñado para validar cadenas de texto.
  * dentro de un conjunto de valores permitidos.
  * @return {InValidator}
  */
  static IN(values) {
    return new InValidator(values)
  }

  /**
  * Devuelve un validador especialmente diseñado para validar fechas.
  * @return {DateValidator}
  */
  static DATE() {
    return new DateValidator()
  }

  /**
  * Devuelve un validador especialmente diseñado para el tipo de dato FLOAT.
  * @param {Number} [min=0.0] Valor mínimo admitido.
  * @param {Number} [max=1E37] Valor máximo admitido.
  * @return {FloatValidator}
  */
  static FLOAT(min = 0, max = 1E37) {
    return new FloatValidator(min, max)
  }

}

module.exports = Validators
