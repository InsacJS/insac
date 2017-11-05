'use strict'
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const DataType = require('./DataType')
/** @ignore */ const BooleanValidator = require('../validators/BooleanValidator')

/**
* Describe el tipo de dato BOOLEAN.
* @extends {DataType}
*/
class BOOLEAN extends DataType {

  /**
  * Crea una instancia de la clase BOOLEAN.
  */
  constructor() {
    super('BOOLEAN', [])
  }

  /**
  * Devuelve un validador para el tipo de dato BOOLEAN.
  * @return {BooleanValidator} instancia de la clase BooleanValidator.
  * @override
  */
  validator() {
    return new BooleanValidator(undefined, undefined)
  }

  /**
  * Devuelve un valor de tipo BOOLEAN.
  * @param {!String} str Dato a parsear.
  * @return {Boolean}
  * @override
  */
  val(str) {
    return str === 'true'
  }

  /**
  * Devuelve el tipo de dato de sequelize de tipo BOOLEAN.
  * @return {SequelizeType}
  * @override
  */
  sequelize() {
    return Sequelize.BOOLEAN()
  }

  /**
  * Devuelve el tipo de dato para la documentación.
  * @return {String}
  */
  apidoc() {
    return 'Boolean'
  }

  /**
  * @return {Boolean}
  */
  example() {
    return true
  }

}

module.exports = BOOLEAN
