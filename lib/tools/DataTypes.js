'use strict'
/** @ignore */ const STRING = require('../datatypes/STRING')
/** @ignore */ const INTEGER = require('../datatypes/INTEGER')
/** @ignore */ const FLOAT = require('../datatypes/FLOAT')
/** @ignore */ const DATE = require('../datatypes/DATE')
/** @ignore */ const TIME = require('../datatypes/TIME')

/**
* Contiene varias funciones que permiten crear diferentes tipos de datos.
*/
class DataTypes {

  /**
  * Devuelve un tipo de dato para trabajar con cadenas de texto.
  * @param {Number} [length=255] Longitud máxima de caracteres.
  * @return {STRING}
  */
  static STRING(length = 255) {
    return new STRING(length)
  }

  /**
  * Devuelve un tipo de dato para trabajar con números enteros.
  * @return {INTEGER}
  */
  static INTEGER() {
    return new INTEGER()
  }

  /**
  * Devuelve un tipo de dato para trabajar con fechas.
  * @return {DATE}
  */
  static DATE() {
    return new DATE()
  }

  /**
  * Devuelve un tipo de dato para trabajar con números decimales.
  * @param {Number} [length=11] Cantidad de dígitos para la parte entera.
  * @param {Number} [decimal=2] Cantidad de dígitos para la parte decimal.
  * @return {FLOAT}
  */
  static FLOAT(length = 11, decimal = 2) {
    return new FLOAT(length, decimal)
  }

  /**
  * Devuelve un tipo de dato para trabajar con horas.
  * @return {TIME}
  */
  static TIME() {
    return new TIME()
  }

}

module.exports = DataTypes
