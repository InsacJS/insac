'use strict'

/**
* Describe las caracteristicas y comportamiento de todos los tipos de datos.
*/
class DataType {

  /**
  * Crea una instancia de la clase DataType.
  * @param {!String} name Nombre que identifica al tipo de dato.
  * @param {!Array} args Argumentos necesarios de acuerdo al tipo de dato.
  */
  constructor(name, args) {
    
    /**
    * Nombre que identifica al tipo de dato.
    * @type {String}
    */
    this.name = name

    /**
    * Argumentos que son necesarios de acuerdo al tipo de dato.
    * @type {Array}
    */
    this.args = args
  }

  /**
  * Devuelve un validador por defecto según el tipo de dato.
  * @abstract
  */
  validator() { }

  /**
  * Devuelve el valor parseado de un dato de tipo string.
  * @param {!String} str Dato a parsear
  * @abstract
  */
  val(str) { }

  /**
  * Crea un tipo de dato para crear un modelo sequelize.
  * @abstract
  */
  sequelize() { }

}

module.exports = DataType
