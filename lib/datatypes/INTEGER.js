'use strict'
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const DataType = require('./DataType')
/** @ignore */ const IntegerValidator = require('../validators/IntegerValidator')

/**
* Describe el tipo de dato Integer.
* @extends {DataType}
*/
class INTEGER extends DataType {

  /**
  * Crea una instancia de la clase INTEGER.
  */
  constructor() {
    super('INTEGER', [])
  }

  /**
  * Devuelve un validador para el tipo de dato INTEGER.
  * @return {IntegerValidator} instancia de la clase IntegerValidator.
  * @override
  */
  validator() {
    return new IntegerValidator(undefined, undefined)
  }

  /**
  * Devuelve un valor de tipo INTEGER.
  * @param {!String} str Dato a parsear.
  * @return {Number}
  * @override
  */
  val(str) {
    return parseInt(str + "")
  }

  /**
  * Devuelve el tipo de dato de sequelize de tipo INTEGER.
  * @return {SequelizeType}
  * @override
  */
  sequelize() {
    return Sequelize.INTEGER()
  }

  /**
  * Devuelve el tipo de dato para la documentación.
  * @return {String}
  */
  apidoc() {
    return 'Number'
  }

  /**
  * @return {Number}
  */
  example() {
    return 1
  }

}

module.exports = INTEGER
