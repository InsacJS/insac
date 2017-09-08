'use strict'
/** @ignore */ const _ = require('lodash')
/** @ignore */ const DataTypes = require('../tools/DataTypes')
/** @ignore */ const Validators = require('../tools/Validators')

/** @ignore */ const THIS = '__THIS__'

/**
* Describe las caracteristicas de un campo de un modelo.
*/
class Field {

  /**
  * Crea una instancia de la clase Field. El método recibe dos argumentos, pero es posible enviar solamente uno el cual se reonocerá como el parámetro field.
  * @param {Object} [field={}] Caracteristicas del campo.
  * @param {DataType} [field.type=STRING] Tipo de dato del campo.
  * @param {Validator} [field.validator] Objeto que se encarga de la validación del campo. Por defecto se asigna un validador de acuerdo al tipo de dato
  * @param {String} [field.description=""] Descripción del campo.
  * @param {Boolean} [field.allowNull=true] Indica si el campo acepta valores nulos.
  * @param {Boolean} [field.primaryKey=false] Indica si el campo es una llave primaria.
  * @param {Boolean} [field.autoIncrement=false] Indica si es un valor autoincrementable.
  * @param {String|Number|Boolean} [field.defaultValue=undefined] Valor por defecto del campo.
  */
  constructor(field = {}) {
    /**
    * Tipo de dato del campo.
    * @type {DataType}
    */
    this.type = field.type || DataTypes.STRING()

    /**
    * Objeto que se encarga de la validación del campo.
    * @type {Validator}
    */
    this.validator = field.validator || this.type.validator()

    /**
    * Descripción del campo.
    * @type {String}
    */
    this.description = field.description || ""

    /**
    * Indica si el campo acepta valores nulos.
    * @type {Boolean}
    */
    this.allowNull = (typeof field.allowNull != 'undefined') ? field.allowNull : true

    /**
    * Indica si el campo es una llave primaria.
    * @type {Boolean}
    */
    this.primaryKey = (typeof field.primaryKey != 'undefined') ? field.primaryKey : false

    /**
    * Indica si es un valor autoincrementable.
    * @type {Boolean}
    */
    this.autoIncrement = (typeof field.autoIncrement != 'undefined') ? field.autoIncrement : false

    /**
    * Valor por defecto del campo.
    * @type {String|Number|Boolean}
    */
    this.defaultValue = field.defaultValue
  }

  update(field = {}) {
    if (typeof field.allowNull != 'undefined') { this.allowNull = field.allowNull }
    if (typeof field.description != 'undefined') { this.description = field.description }
    if (typeof field.defaultValue != 'undefined') { this.defaultValue = field.defaultValue }
  }

  validate(str) {
    if (typeof str == 'undefined') {
      if (this.allowNull) {
        return { isValid:true, value:str }
      } else {
        return { isValid: false, msg:`El campo es requerido` }
      }
    } else {
      if (this.validator) {
        return this.validator.validate(str)
      } else {
        return { isValid:true, value:str }
      }
    }
  }

  /**
  * Devuelve un objeto para el campo de un modelo sequelize (SequelizeModel)
  * @return {Object} Campo de un modelo sequelize (SequelizeModel).
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

  // Devuelve una función que devuelve la copia de un field y opcionalmente actualiza sus propiedades
  static THIS(options) {
    return (field) => {
      let clone = _.clone(field, true)
      clone.update(options)
      return clone
    }
  }

  /**
  * Devuelve un campo de tipo ID
  * @return {Field}
  */
  static ID() {
    return new Field({
      type: DataTypes.INTEGER(),
      description: 'Identificador único',
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    })
  }

  static AUTHORIZATION() {
    return new Field({
      type: DataTypes.STRING(),
      description: 'Token de acceso',
      allowNull: false
    })
  }

  static INTEGER(options = {}) {
    if (arguments.length == 1) {
      if (typeof arguments[0] == 'object') {
        options.type = DataTypes.INTEGER()
        return new Field(options)
      } else {
        throw new Error(`El parámetro 'options' debe ser de tipo 'object'. Se recibió: options = ${options}`)
      }
    }
    return new Field({type:DataTypes.INTEGER()})
  }

  static STRING(length, options) {
    if (arguments.length == 2) {
      if ((typeof arguments[0] == 'number') && (typeof arguments[1] == 'object')) {
        options.type = DataTypes.STRING(length)
        return new Field(options)
      } else {
        throw new Error(`El parámetro 'length' debe ser un número entero y el parámetro 'options' un objeto. Se recibió: length = ${length}, options = ${options}`)
      }
    }
    if (arguments.length == 1) {
      if (typeof arguments[0] == 'number') {
        return new Field({type: DataTypes.STRING(length)})
      }
      if (typeof arguments[0] == 'object') {
        options = length
        options.type = DataTypes.STRING()
        return new Field(options)
      }
    }
    return new Field({type:DataTypes.STRING()})
  }

}

module.exports = Field
