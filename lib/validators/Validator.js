'use strict'

/**
* Describe las características y comportamiento de todos los validadores.
*/
class Validator {

  /**
  * Crea una instancia de la clase Validator.
  * @param {!String} name Nombre que identifica al tipo de validador.
  * @param {!Array} args Argumentos necesarios de acuerdo al tipo de validador.
  */
  constructor(name, args) {

    /**
    * Nombre que identifica al tipo de validador.
    * @type {String}
    */
    this.name = name

    /**
    * Argumentos necesarios de acuerdo al tipo de validador.
    * @type {Array}
    */
    this.args = args
  }

  /**
  * Parsea una cadena de texto (dato de entrada), y devuelve un objeto con
  * algunas propiedades que indican el resultado de la validación.
  * @abstract
  */
  validate() { }

  /**
  * Devuelve el tipo de dato para la documentación
  * @abstract
  */
  apidocType() { }

}

module.exports = Validator
