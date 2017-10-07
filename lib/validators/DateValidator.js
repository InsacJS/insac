'use strict'
/** @ignore */ const validator = require('validator')
/** @ignore */ const Validator = require('./Validator')

/**
* Describe un validador para validar palabras dentro de un conjunto de valores permitidos.
* @extends {Validator}
*/
class DateValidator extends Validator {

  /**
  * Crea una instancia de la clase DateValidator.
  */
  constructor() {
    super('DATE', [])
  }

  /**
  * Parsea una cadena de texto (dato de entrada), y devuelve un objeto con
  * algunas propiedades que indican el resultado de la validación.
  * @param {String} str Dato de entrada a parsear y validar.
  * @return {Object} result Resultado del parseo y la validación. Devuelve
  * las propiedades isValid, value y message.
  * @property {Boolean} result.isValid - Indica si el dato es válido.
  * @property {String|Integer|Boolean} result.value - Valor parseado.
  * @property {String} result.message - Mensaje que describe los resultados de la validación.
  * @override
  */
  validate(str) {
    if ((typeof str == 'string') && (validator.toDate(str) != null)) {
      return { isValid:true, value:str, message:'El campo es válido' }
    }
    return { isValid:false, value:str, message:`Debe tener el formato de una fecha válida` }
  }

  /**
  * Devuelve el tipo de dato para la documentación
  * @return {String}
  */
  apidocType() {
    return `String`
  }

}

module.exports = DateValidator
