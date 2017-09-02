'use strict'
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const DataType = require('./DataType')
/** @ignore */ const STRING_VALIDATOR = require('../validators/STRING_VALIDATOR')

/**
* Describe el tipo de dato STRING.
* @extends {DataType}
*/
class STRING extends DataType {

  /**
  * Crea una instancia de la clase STRING.
  * @param {Number} [length=255] Longitud máxima de caracteres.
  */
  constructor(length = 255) {
    super('STRING', [length])

    /**
    * Cantidad máxima de caracterres.
    * @type {Number}
    */
    this.length = length
  }

  /**
  * Devuelve un validador para el tipo de dato STRING.
  * @return {STRING_VALIDATOR} instancia de la clase STRING_VALIDATOR.
  * @override
  */
  validator() {
    return new STRING_VALIDATOR(undefined, this.length)
  }

  /**
  * Devuelve un tipo de dato de tipo STRING para crear modelos Sequelize
  * @return {SequelizeType}
  * @override
  */
  sequelize() {
    return Sequelize.STRING(this.length)
  }

}

module.exports = STRING
