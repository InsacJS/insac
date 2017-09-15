'use strict'
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const DataType = require('./DataType')
/** @ignore */ const StringValidator = require('../validators/StringValidator')

/**
* Describe el tipo de dato String.
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
    * Cantidad máxima de caracteres.
    * @type {Number}
    */
    this.length = length
  }

  /**
  * Devuelve un validador para el tipo de dato STRING.
  * @return {StringValidator} instancia de la clase StringValidator.
  * @override
  */
  validator() {
    return new StringValidator(undefined, this.length)
  }

  /**
  * Devuelve un valor de tipo STRING.
  * @param {!String} str Dato a parsear.
  * @return {String}
  * @override
  */
  val(str) {
    return str + ""
  }

  /**
  * Devuelve el tipo de dato de sequelize de tipo STRING.
  * @return {SequelizeType}
  * @override
  */
  sequelize() {
    return Sequelize.STRING(this.length)
  }

}

module.exports = STRING
