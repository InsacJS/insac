'use strict'
/** @ignore */ const Sequelize = require('sequelize')
/** @ignore */ const DataType = require('./DataType')
/** @ignore */ const EnumValidator = require('../validators/EnumValidator')

/**
* Describe el tipo de dato ENUM.
* @extends {DataType}
*/
class ENUM extends DataType {

  /**
  * Crea una instancia de la clase ENUM.
  * @param {String[]} values Lista de valores posibles.
  */
  constructor(values) {
    super('ENUM', [values])

    /**
    * Lista de valores posibles.
    * @type {String[]}
    */
    this.values = values
  }

  /**
  * Devuelve un validador para el tipo de dato ENUM.
  * @return {EnumValidator} instancia de la clase EnumValidator.
  * @override
  */
  validator() {
    return new EnumValidator(this.values)
  }

  /**
  * Devuelve un valor de tipo ENUM.
  * @param {!String} str Dato a parsear.
  * @return {String}
  * @override
  */
  val(str) {
    return str + ''
  }

  /**
  * Devuelve el tipo de dato de sequelize de tipo ENUM.
  * @return {SequelizeType}
  * @override
  */
  sequelize() {
    return Sequelize.ENUM(this.values)
  }

  /**
  * Devuelve el tipo de dato para la documentación.
  * @param {Boolean} onlyType Indica si solamente devolverá el tipo de dato ó
  * el tipo de dato incluido los argumentos extra.
  * @return {String}
  */
  apidoc(onlyType) {
    if (onlyType === true) {
      return `String`
    }
    return `String=${this.values.toString()}`
  }

  /**
  * @return {String}
  */
  example() {
    return 'text'
  }

}

module.exports = ENUM
