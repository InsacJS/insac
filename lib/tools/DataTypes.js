'use strict'
/** @ignore */ const STRING = require('../datatypes/STRING')
/** @ignore */ const INTEGER = require('../datatypes/INTEGER')

/**
* Contiene varias funciones que permiten crear diferentes tipos de datos
*/
class DataTypes {

  /**
  * Devuelve un tipo de dato para trabajar con cadenas de texto.
  * @param {Number} [length=255] Longitud máxima de caracteres.
  * @return {STRING} Tipo de dato STRING.
  */
  static STRING(length = 255) {
    return new STRING(length)
  }

  /**
  * Devuelve un tipo de dato para trabajar con números enteros.
  * @return {INTEGER} Tipo de dato INTEGER.
  */
  static INTEGER() {
    return new INTEGER()
  }

}

module.exports = DataTypes
