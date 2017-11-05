'use strict'
/** @ignore */ const validator = require('validator')
/** @ignore */ const Validator = require('./Validator')

/**
* Describe un validador para el tipo de dato INTEGER.
* @extends {Validator}
*/
class BooleanValidator extends Validator {

  /**
  * Crea una instancia de la clase BooleanValidator.
  */
  constructor() {
    super('BOOLEAN', [])
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
    if (validator.isBoolean(str + '')) {
      return { isValid:true, value:str, message:'El campo es válido' }
    }
    return { isValid:false, value:str, message:`Debe ser true o false (Boolean)` }
  }

  /**
  * Devuelve el tipo de dato para la documentación
  * @return {String}
  */
  apidocType() {
    return `Boolean`
  }

}

module.exports = BooleanValidator
