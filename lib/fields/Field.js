'use strict'
/** @ignore */ const DataTypes = require('../tools/DataTypes')
/** @ignore */ const Validators = require('../tools/Validators')

/**
* Describe las caracteristicas y comportamiento del campo de un modelo.
*/
class Field {

  /**
  * Crea una instancia de la clase Field.
  * @param {Object} [properties={}] Propiedades del campo.
  */
  constructor(properties = {}) {

    /**
    * Tipo de dato del campo.
    * @type {DataType}
    */
    this.type = properties.type || DataTypes.STRING()

    /**
    * Objeto que se encarga de la validación del campo.
    * @type {Validator}
    */
    this.validator = (typeof properties.validator != 'undefined') ? properties.validator : this.type.validator()

    /**
    * Descripción del campo.
    * @type {String}
    */
    this.description = properties.description || ""

    /**
    * Indica si el campo acepta valores nulos.
    * @type {Boolean}
    */
    this.allowNull = (typeof properties.allowNull != 'undefined') ? properties.allowNull : true

    /**
    * Indica si el campo es una llave primaria.
    * @type {Boolean}
    */
    this.primaryKey = (typeof properties.primaryKey != 'undefined') ? properties.primaryKey : false

    /**
    * Indica si es un valor autoincrementable.
    * @type {Boolean}
    */
    this.autoIncrement = (typeof properties.autoIncrement != 'undefined') ? properties.autoIncrement : false

    /**
    * Valor por defecto del campo.
    * @type {String|Number|Boolean}
    */
    this.defaultValue = properties.defaultValue

    /**
    * Almacena un valor de ejemplo, para incluirlo en la documentación.
    * @type {String|Number|Boolean}
    */
    this.example = properties.example || this.type.example()
  }

  /**
  * Actualiza las propiedades del campo
  * @param {Object} [properties={}] Propiedades ha actualizar.
  */
  update(properties = {}) {
    if (typeof properties.type != 'undefined') { this.type = properties.type }
    if (typeof properties.validator != 'undefined') { this.validator = properties.validator }
    if (typeof properties.description != 'undefined') { this.description = properties.description }
    if (typeof properties.allowNull != 'undefined') { this.allowNull = properties.allowNull }
    if (typeof properties.primaryKey != 'undefined') { this.primaryKey = properties.primaryKey }
    if (typeof properties.autoIncrement != 'undefined') { this.autoIncrement = properties.autoIncrement }
    if (typeof properties.defaultValue != 'undefined') { this.defaultValue = properties.defaultValue }
  }

  /**
  * Parsea una cadena de texto (dato de entrada), y devuelve un objeto con
  * algunas propiedades que indican el resultado de la validación.
  * @param {String} str Dato de entrada a parsear y validar.
  * @return {Object} result Resultado del parseo y la validación. Devuelve
  * las propiedades isValid, value y message.
  * @property {Boolean} result.isValid - Indica si el dato es válido.
  * @property {String|Integer|Boolean} result.value - Valor parseado.
  * @property {String} result.message - Mensaje que describe los resultados de la validación.
  */
  validate(str) {
    if (typeof str == 'undefined') {
      if (this.allowNull) {
        return { isValid: true, value:str, message:'El campo es válido' }
      } else {
        return { isValid: false, value:str, message:`El campo es requerido` }
      }
    } else {
      if (this.validator != null) {
        return this.validator.validate(str)
      } else {
        return { isValid:true, value:str, message:'El campo es válido' }
      }
    }
  }

  /**
  * Devuelve un objeto que contiene las propiedades para crear un objeto de tipo SequelizeField.
  * @return {Object} Propiedades para crear un objeto de tipo SequelizeField.
  */
  sequelize() {
    let attribute = {
      type: this.type.sequelize()
    }
    if (typeof this.allowNull != 'undefined') attribute.allowNull = this.allowNull
    if (typeof this.primaryKey != 'undefined') attribute.primaryKey = this.primaryKey
    if (typeof this.autoIncrement != 'undefined') attribute.autoIncrement = this.autoIncrement
    if (typeof this.defaultValue != 'undefined') attribute.defaultValue = this.defaultValue
    return attribute
  }

  /**
  * Devuelve el tipo de dato para generar la documentación.
  * @param {Boolean} onlyType Indica si solamente se devolverá el tipo de dato ó
  * si se incluiran también los argumentos que pueda tener.
  * @return {String}
  */
  apidocType(onlyType) {
    if (onlyType === true) {
      return this.type.apidoc(onlyType)
    }
    return this.validator ? this.validator.apidocType() : this.type.apidoc()
  }

  /**
  * Devuelve el nombre de una propiedad, para generar la documentación.
  * @param {String} prop Nombre completo del campo.
  * @return {String}
  */
  apidocProp(prop) {
    prop = (typeof this.defaultValue != 'undefined') ? `${prop}=${this.defaultValue}` : prop
    return this.allowNull ? `[${prop}]` : prop
  }

}

module.exports = Field
