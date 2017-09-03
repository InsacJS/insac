'use strict'
/** @ignore */ const String = require('../datatypes/String')
/** @ignore */ const Integer = require('../datatypes/Integer')

/**
* Contiene varias funciones que permiten crear diferentes tipos de datos
*/
class DataTypes {

  /**
  * Devuelve un tipo de dato para trabajar con cadenas de texto.
  * @param {Number} [length=255] Longitud máxima de caracteres.
  * @return {String} Tipo de dato String.
  */
  static STRING(length = 255) {
    return new String(length)
  }

  /**
  * Devuelve un tipo de dato para trabajar con números enteros.
  * @return {Integer} Tipo de dato Integer.
  */
  static INTEGER() {
    return new Integer()
  }

}

module.exports = DataTypes
