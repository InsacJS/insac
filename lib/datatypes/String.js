'use strict'
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const DataType = require('./DataType')
/** @ignore */ const StringValidator = require('../validators/StringValidator')

/**
* Describe el tipo de dato String.
* @extends {DataType}
*/
class String extends DataType {

  /**
  * Crea una instancia de la clase String.
  * @param {Number} [length=255] Longitud máxima de caracteres.
  */
  constructor(length = 255) {
    super('String', [length])

    /**
    * Cantidad máxima de caracterres.
    * @type {Number}
    */
    this.length = length
  }

  /**
  * Devuelve un validador para el tipo de dato String.
  * @return {StringValidator} instancia de la clase StringValidator.
  * @override
  */
  validator() {
    return new StringValidator(undefined, this.length)
  }

  val(str) {
    return str + ""
  }

  /**
  * Devuelve un tipo de dato de tipo String para crear modelos Sequelize
  * @return {SequelizeType}
  * @override
  */
  sequelize() {
    return Sequelize.STRING(this.length)
  }

}

module.exports = String
