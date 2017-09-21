'use strict'
/** @ignore */ const validator = require('validator')
/** @ignore */ const Validator = require('./Validator')

/**
* Describe un validador para validar texto con formato de 24 horas (HH:MM:SS),
* valida que la hora se encuentre el el rango de 00:00:00 a 24:00:00 horas.
* @extends {Validator}
*/
class TimeValidator extends Validator {

  /**
  * Crea una instancia de la clase TimeValidator.
  */
  constructor() {
    super('TIME', [])
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
    if ((typeof str == 'string') && ((str.length == 5) || (str.length == 8))) {
      let h = parseInt(str.substr(0, 2))
      let m = parseInt(str.substr(3, 2))
      let s = (str.length == 8) ? parseInt(str.substr(6, 2)) : 0
      if ((h != NaN) && (m != NaN) && (s != NaN) && (((h < 24) && (m < 60) && (s < 60)) || ((h == 24) && (m == 0) && (s == 0)))) {
        if ((str.length == 5)) str += ":00"
        return { isValid:true, value:str, message:'El campo es válido' }
      }
    }
    return { isValid:false, value:str, message:`Debe ser una hora válida con formato 'HH:MM:SS', mínimo '00:00:00' máximo '24:00:00'` }
  }

  /**
  * Devuelve el tipo de dato para la documentación
  * @return {String}
  */
  apidocType() {
    return `String`
  }

}

module.exports = TimeValidator
