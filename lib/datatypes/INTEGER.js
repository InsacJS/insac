'use strict'
/** @ignore */ const DataType = require('./DataType')
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const INTEGER_VALIDATOR = require('../validators/INTEGER_VALIDATOR')

/**
* Describe el tipo de dato INTEGER.
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
  * @return {INTEGER_VALIDATOR} instancia de la clase INTEGER_VALIDATOR.
  * @override
  */
  validator() {
    return new INTEGER_VALIDATOR(undefined, undefined)
  }

  /**
  * Devuelve un tipo de dato de tipo INTEGER para crear modelos Sequelize
  * @return {SequelizeType}
  * @override
  */
  sequelize() {
    return Sequelize.INTEGER()
  }

}

module.exports = INTEGER
