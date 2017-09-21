'use strict'
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const DataType = require('./DataType')
/** @ignore */ const TimeValidator = require('../validators/TimeValidator')

/**
* Describe el tipo de dato TIME.
* @extends {DataType}
*/
class TIME extends DataType {

  /**
  * Crea una instancia de la clase TIME.
  */
  constructor() {
    super('TIME', [])
  }

  /**
  * Devuelve un validador para el tipo de dato TIME.
  * @return {TimeValidator} instancia de la clase TimeValidator.
  * @override
  */
  validator() {
    return new TimeValidator(undefined, undefined)
  }

  /**
  * Devuelve un valor de tipo TIME.
  * @param {!String} str Dato a parsear.
  * @return {String}
  * @override
  */
  val(str) {
    return str + ""
  }

  /**
  * Devuelve el tipo de dato de sequelize de tipo TIME.
  * @return {SequelizeType}
  * @override
  */
  sequelize() {
    return Sequelize.TIME()
  }

  /**
  * Devuelve el tipo de dato para la documentación.
  * @return {String}
  */
  apidoc() {
    return 'String'
  }

  /**
  * @return {String}
  */
  example() {
    return "20:39:00"
  }

}

module.exports = TIME
