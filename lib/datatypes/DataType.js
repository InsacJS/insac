'use strict'

/**
* Describe las caracteristicas y comportamientp de todos los tipos de datos
*/
class DataType {

  /**
  * Crea una instancia de la clase DataType.
  * @param {String} name Nombre que identifica al tipo de dato.
  * @param {Array} args Argumentos necesarios de acuerdo al tipo de dato.
  */
  constructor(name, args) {
    /**
    * Nombre que identifica al tipo de dato.
    * @type {String}
    */
    this.name = name

    /**
    * Argumentos necesarios de acuerdo al tipo de dato.
    * @type {Array}
    */
    this.args = args
  }

  /**
  * Crea un validador por defecto segun el tipo de dato
  * @abstract
  */
  validator() { }

  val(str) { }

  /**
  * Crea un tipo de dato para crear un modelo sequelize
  * @abstract
  */
  sequelize() { }

}

module.exports = DataType
