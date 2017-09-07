'use strict'

/**
* Describe las caracteristicas y comportamiento de todos los validadores
*/
class Validator {

  /**
  * Crea una instancia de la clase Validator.
  * @param {String} name Nombre que identifica al tipo de validador.
  * @param {Array} args Argumentos necesarios de acuerdo al tipo de validador.
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

  validate(str) { }

}

module.exports = Validator
