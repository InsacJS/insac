'use strict'
/** @ignore */ const Field = require('./Field')

/** @ignore */ const ONE_TO_ONE = '1:1'
/** @ignore */ const ONE_TO_MANY = '1:N'

/**
* Describe un campo que hace referencia a otra tabla
* @extends {Field}
*/
class Reference extends Field {

  /**
  * Crea una instancia de la clase Reference.
  * @param {Object} [field={}] Caracteristicas del campo.
  * @param {DataType} [field.type=STRING] Tipo de dato del campo.
  * @param {Validator} [field.validator] Objeto que se encarga de la validación del campo. Por defecto se asigna un validador de acuerdo al tipo de dato
  * @param {String} [field.description=undefined] Descripción del campo.
  * @param {Boolean} [field.allowNull=true] Indica si el campo acepta valores nulos.
  * @param {Boolean} [field.unique=false] Indica si en todos los registros debe haber solamente uno con este valor.
  * @param {Boolean} [field.primaryKey=false] Indica si el campo es una llave primaria.
  * @param {Boolean} [field.autoIncrement=false] Indica si es un valor autoincrementable.
  * @param {String|Number|Boolean} [field.defaultValue=undefined] Valor por defecto del campo.
  * @param {!Object} reference Datos de la referencia.
  * @param {!String} reference.model Nombre del modelo al que se hace referencia.
  * @param {String} [reference.as] Nombre con el que se identificará el modelo. Por defecto, si el tipo de relación es ONE_TO_ONE, as = model, y si es ONE_TO_MANY, as = model + s.
  * @param {String} [reference.type='1:1'] Tipo de referencia. Valores posibles: '1:1' ó '1:N'
  * @param {String} [reference.key='id'] Nombre del campo ID del modelo de referencia
  */
  constructor(field, reference) {
    super(field)
    let model = reference.model
    let type = reference.type || ONE_TO_ONE
    let as = reference.as || model
    let key = reference.key || 'id'

    /**
    * Datos de la referencia.
    * @type {Object}
    * @property {!String} reference.model - Nombre del modelo al que se hace referencia.
    * @property {String} [reference.as] - Nombre con el que se identificará al modelo.
    * @property {String} [reference.type='1:1'] - Tipo de referencia.
    */
    this.reference = {model:model, as:as, type:type, key:key}
  }

  /**
  * Devuelve un objeto para el campo de un modelo sequelize (SequelizeModel)
  * @return {Object} Campo de un modelo sequelize (SequelizeModel).
  * @override
  */
  sequelize() {
    let attribute = super.sequelize()
    attribute.references = {
      model: this.reference.model,
      as: this.reference.as,
      key: this.reference.key
    }
    return attribute
  }

  getModelOfProperty(property, models) {
    return (this.reference.model == property) ? models[this.reference.model] : undefined
  }

  /**
  * Devuelve un campo que hace referncia a otra tabla con una relación de uno a uno.
  * @param {!Model} model - Modelo al que se hace referencia.
  * @param {Object} [field={}] Caracteristicas del campo.
  * @param {Boolean} [field.allowNull=true] Indica si el campo acepta valores nulos.
  * @param {Boolean} [field.unique=false] Indica si en todos los registros debe haber solamente uno con este valor.
  * @param {Boolean} [field.primaryKey=false] Indica si el campo es una llave primaria.
  * @param {Boolean} [field.autoIncrement=false] Indica si es un valor autoincrementable.
  * @param {String|Number|Boolean} [field.defaultValue=undefined] Valor por defecto del campo.
  * @return {Reference} Instancia de la clase Reference
  */
  static ONE_TO_ONE(model, field = {}) {
    let key = field.key ? field.key : 'id'
    field.type = model.fields[key].type
    field.validator = model.fields[key].validator
    field.description = `${model.fields[key].description} del registro '${model.name}'`
    return new Reference(field, {model:model.name, as:field.as, type:ONE_TO_ONE, key:key})
  }

  /**
  * Devuelve un campo que hace referncia a otra tabla con una relación de uno a muchos.
  * @param {!Model} model - Modelo al que se hace referencia.
  * @param {Object} [field={}] Caracteristicas del campo.
  * @param {Boolean} [field.allowNull=true] Indica si el campo acepta valores nulos.
  * @param {Boolean} [field.unique=false] Indica si en todos los registros debe haber solamente uno con este valor.
  * @param {Boolean} [field.primaryKey=false] Indica si el campo es una llave primaria.
  * @param {Boolean} [field.autoIncrement=false] Indica si es un valor autoincrementable.
  * @param {String|Number|Boolean} [field.defaultValue=undefined] Valor por defecto del campo.
  * @return {Reference} Instancia de la clase Reference
  */
  static ONE_TO_MANY(model, field = {}) {
    let key = field.key ? field.key : 'id'
    field.type = model.fields[key].type
    field.validator = model.fields[key].validator
    field.description = `${model.fields[key].description} del registro '${model.name}'`
    return new Reference(field, {model:model.name, as:field.as, type:ONE_TO_MANY, key:key})
  }

}

module.exports = Reference
