'use strict'
/** @ignore */ const DataTypes = require('../tools/DataTypes')

/**
* Describe las caracteristicas de un campo de un modelo.
*/
class Field {

  /**
  * Crea una instancia de la clase Field. El método recibe dos argumentos, pero es posible enviar solamente uno el cual se reonocerá como el parámetro field.
  * @param {String} [name='field'] Nombre del campo.
  * @param {Object} [field={}] Caracteristicas del campo.
  * @param {DataType} [field.type=STRING] Tipo de dato del campo.
  * @param {Validator} [field.validator] Objeto que se encarga de la validación del campo. Por defecto se asigna un validador de acuerdo al tipo de dato
  * @param {String} [field.description=undefined] Descripción del campo.
  * @param {Boolean} [field.allowNull=true] Indica si el campo acepta valores nulos.
  * @param {Boolean} [field.primaryKey=false] Indica si el campo es una llave primaria.
  * @param {Boolean} [field.autoIncrement=false] Indica si es un valor autoincrementable.
  * @param {String|Number|Boolean} [field.defaultValue=undefined] Valor por defecto del campo.
  */
  constructor(name, field) {
    // Se actualizan los parámetros de entrada en base al numero de argmunetos recibidos
    if (arguments.length <= 1) {
      name = 'field'
      field = (arguments.length == 1) ? arguments[0] : {}
    }

    /**
    * Nombre del campo.
    * @type {String}
    */
    this.name = name

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
    this.description = field.description || undefined

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
    this.defaultValue = field.defaultValue || undefined
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

  /**
  * Devuelve un campo de tipo ID
  * @return {Field}
  */
  static ID() {
    return new Field('id', {
      type: DataTypes.INTEGER(),
      description: 'Identificador único',
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    })
  }

}

Field.THIS = '__this__'

module.exports = Field
