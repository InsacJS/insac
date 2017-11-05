'use strict'
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const DataType = require('./DataType')
/** @ignore */ const DatetimeValidator = require('../validators/DatetimeValidator')

/**
* Describe el tipo de dato DATETIME.
* @extends {DataType}
*/
class DATETIME extends DataType {

  /**
  * Crea una instancia de la clase DATETIME.
  */
  constructor() {
    super('DATETIME', [])
  }

  /**
  * Devuelve un validador para el tipo de dato DATETIME.
  * @return {DatetimeValidator} instancia de la clase DatetimeValidator.
  * @override
  */
  validator() {
    return new DatetimeValidator()
  }

  /**
  * Devuelve un valor de tipo DATETIME.
  * @param {!String} str Dato a parsear.
  * @return {String}
  * @override
  */
  val(str) {
    return new Date(str + '').toString()
  }

  /**
  * Devuelve el tipo de dato de sequelize de tipo DATETIME.
  * @return {SequelizeType}
  * @override
  */
  sequelize() {
    return Sequelize.DATE
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

module.exports = DATETIME
