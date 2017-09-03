'use strict'
/** @ignore */ const DataType = require('./DataType')
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const IntegerValidator = require('../validators/IntegerValidator')

/**
* Describe el tipo de dato Integer.
* @extends {DataType}
*/
class Integer extends DataType {

  /**
  * Crea una instancia de la clase Integer.
  */
  constructor() {
    super('Integer', [])
  }

  /**
  * Devuelve un validador para el tipo de dato Integer.
  * @return {IntegerValidator} instancia de la clase IntegerValidator.
  * @override
  */
  validator() {
    return new IntegerValidator(undefined, undefined)
  }

  /**
  * Devuelve un tipo de dato de tipo Integer para crear modelos Sequelize
  * @return {SequelizeType}
  * @override
  */
  sequelize() {
    return Sequelize.INTEGER()
  }

}

module.exports = Integer
