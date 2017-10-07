'use strict'
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const DataType = require('./DataType')
/** @ignore */ const DateValidator = require('../validators/DateValidator')

/**
* Describe el tipo de dato DATE.
* @extends {DataType}
*/
class DATE extends DataType {

  /**
  * Crea una instancia de la clase DATE.
  */
  constructor() {
    super('DATE', [])
  }

  /**
  * Devuelve un validador para el tipo de dato DATE.
  * @return {DateValidator} instancia de la clase DateValidator.
  * @override
  */
  validator() {
    return new DateValidator(undefined, undefined)
  }

  /**
  * Devuelve un valor de tipo DATE.
  * @param {!String} str Dato a parsear.
  * @return {String}
  * @override
  */
  val(str) {
    return new Date(str + '').toString()
  }

  /**
  * Devuelve el tipo de dato de sequelize de tipo DATE.
  * @return {SequelizeType}
  * @override
  */
  sequelize() {
    return Sequelize.DATE()
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
    return '06/07/2017 20:39:00'
  }

}

module.exports = DATE
