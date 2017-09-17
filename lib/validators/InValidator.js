'use strict'
/** @ignore */ const validator = require('validator')
/** @ignore */ const Validator = require('./Validator')

/**
* Describe un validador para validar palabras dentro de un conjunto de valores permitidos.
* @extends {Validator}
*/
class InValidator extends Validator {

  /**
  * Crea una instancia de la clase InValidator.
  * @param {!String[]} values Lista de valores permitidos.
  */
  constructor(values) {
    super('STRING', [values])

    /**
    * Valores permitidos
    * @type {String[]}
    */
    this.values = values
  }

  /**
  * Parsea una cadena de texto (dato de entrada), y devuelve un objeto con
  * algunas propiedades que indican el resultado de la validación.
  * @param {String} str Dato de entrada a parsear y validar.
  * @return {Object} result Resultado del parseo y la validación. Devuelve
  * las propiedades isValid, value y message.
  * @override
  */
  validate(str) {
    if ((typeof str == 'string') && validator.isIn(str, this.values)) {
      return { isValid:true, value:str, message:'El campo es válido' }
    }
    return { isValid:false, value:str, message:`Valores permitidos: ${this.values.toString()}` }
  }

  /**
  * Devuelve el tipo de dato para la documentación
  * @return {String}
  */
  apidocType() {
    return `String=${this.values.toString()}`
  }

}

module.exports = InValidator
