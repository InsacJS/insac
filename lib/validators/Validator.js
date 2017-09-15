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
  * @param {String} str Dato de entrada a parsear y validar.
  * @property {Boolean} result.isValid - Indica si el dato es válido.
  * @property {String|Integer|Boolean} result.value - Valor parseado.
  * @property {String} result.message - Mensaje que describe los resultados de la validación.
  * @abstract
  */
  validate(str) { }

}

module.exports = Validator
