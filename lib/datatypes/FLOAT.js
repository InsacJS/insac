'use strict'
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const DataType = require('./DataType')
/** @ignore */ const FloatValidator = require('../validators/FloatValidator')

/**
* Describe el tipo de dato FLOAT.
* @extends {DataType}
*/
class FLOAT extends DataType {

  /**
  * Crea una instancia de la clase FLOAT.
  */
  constructor() {
    super('FLOAT', [])
  }

  /**
  * Devuelve un validador para el tipo de dato FLOAT.
  * @return {FloatValidator} instancia de la clase FloatValidator.
  * @override
  */
  validator() {
    return new FloatValidator(undefined, undefined)
  }

  /**
  * Devuelve un valor de tipo FLOAT.
  * @param {!String} str Dato a parsear.
  * @return {Number}
  * @override
  */
  val(str) {
    return parseFloat(str + '')
  }

  /**
  * Devuelve el tipo de dato de sequelize de tipo FLOAT.
  * @return {SequelizeType}
  * @override
  */
  sequelize() {
    return Sequelize.FLOAT()
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
    return 1.59
  }

}

module.exports = FLOAT
