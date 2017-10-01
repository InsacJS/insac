'use strict'
/** @ignore */ const Field = require('../fields/Field')
/** @ignore */ const Reference = require('../fields/Reference')
/** @ignore */ const DataTypes = require('../tools/DataTypes')
/** @ignore */ const Validators = require('../tools/Validators')

/**
* Contiene varias funciones que permiten crear diferentes tipos de fields.
*/
class Fields {

  /**
  * Devuelve una instancia de la clase Field, a partir de otro objeto,
  * con la ventaja de modificar las propiedades.
  * @param {!Field} field Objeto del que se copiaran las propiedades.
  * @param {Object} [properties] Propiedades ha modificar para el nuevo objeto.
  * @return {Field}
  */
  static COPY(field, properties = {}) {
    if (!(field instanceof Field)) {
      let msg = `La propiedad 'field' debe ser una instancia de la clase Field`
      throw new Error(msg)
    }
    let newField = new Field(field)
    newField.update(properties)
    return newField
  }

  /**
  * Devuelve una función que permite crear un Field a partir de otro field,
  * pasándole primeramente las propiedades ha modificar, seguido del objeto
  * del cual se aprovecharán las propiedades.
  * que pertenece al modelo de una ruta, con el objetivo de cambiar algunas propiedades.
  * @param {Object} [properties] Propiedades ha modificar para el nuevo objeto.
  * @return {Function} Funcion al que se le pasa como argumento un field, que
  * tendrá las propiedades descritas ahora.
  */
  static THIS(properties = {}) {
    return function THIS(field) {
      return Fields.COPY(field, properties)
    }
  }

  /**
  * Devuelve una instancia de la clase Field que representa al campo ID de un modelo.
  * @param {Object} [properties] Propiedades a modificar del valor por defecto.
  * @return {Field}
  */
  static ID(properties = {}) {
    let field = new Field({
      type: DataTypes.INTEGER(),
      description: 'Identificador único',
      required: true,
      primaryKey: true,
      autoIncrement: true
    })
    field.update(properties)
    return field
  }

  /**
  * Devuelve una instancia de la clase Field que representa al campo EMAIL de un modelo.
  * @param {Object} [properties] Propiedades a modificar del valor por defecto.
  * @return {Field}
  */
  static EMAIL(properties) {
    let field = new Field({
      type: DataTypes.STRING(255),
      description: 'Dirección de correo electrónico',
      validator: Validators.EMAIL(1, 255)
    })
    field.update(properties)
    return field
  }

  /**
  * Devuelve una instancia de la clase Field que representa al campo TOKEN.
  * @param {Object} [properties] Propiedades a modificar del valor por defecto.
  * @return {Field}
  */
  static TOKEN(properties = {}) {
    let field = new Field({
      type: DataTypes.STRING(),
      description: 'Token de acceso',
      required: true,
      validator: null
    })
    field.update(properties)
    return field
  }

  /**
  * Devuelve una instancia de la clase Field que representa al campo CREATED_AT.
  * @param {Object} [properties] Propiedades a modificar del valor por defecto.
  * @return {Field}
  */
  static CREATED_AT(properties = {}) {
    let field = new Field({
      type: DataTypes.DATE(),
      description: 'Fecha de creación'
    })
    field.update(properties)
    return field
  }

  /**
  * Devuelve una instancia de la clase Field que representa al campo UPDATED_AT.
  * @param {Object} [properties] Propiedades a modificar del valor por defecto.
  * @return {Field}
  */
  static UPDATED_AT(properties = {}) {
    let field = new Field({
      type: DataTypes.DATE(),
      description: 'Fecha de modificación'
    })
    field.update(properties)
    return field
  }

  /**
  * Devuelve una instancia de la clase Field que representa un campo de tipo STRING.
  * @param {Number} [length] Longitud de la cadena de texto.
  * @param {Object} [properties] Propiedades del campo.
  * @return {Field}
  */
  static STRING(length, properties = {}) {
    if (arguments.length == 0) {
      properties.type = DataTypes.STRING()
      return new Field(properties)
    }
    if (arguments.length == 1) {
      if (typeof arguments[0] == 'number') {
        properties.type = DataTypes.STRING(length)
      } else {
        properties = length
        properties.type = DataTypes.STRING()
      }
      return new Field(properties)
    }
    if (arguments.length == 2) {
      properties.type = DataTypes.STRING(length)
      return new Field(properties)
    }
  }

  /**
  * Devuelve una instancia de la clase Field que representa un campo de tipo INTEGER.
  * @param {Object} [properties] Propiedades del campo.
  * @return {Field}
  */
  static INTEGER(properties = {}) {
    properties.type = DataTypes.INTEGER()
    return new Field(properties)
  }

  /**
  * Devuelve una instancia de la clase Field que representa un campo de tipo FLOAT.
  * @param {Object} [properties] Propiedades del campo.
  * @return {Field}
  */
  static FLOAT(properties = {}) {
    properties.type = DataTypes.FLOAT()
    return new Field(properties)
  }

  /**
  * Devuelve una instancia de la clase Field que representa un campo de tipo DATE.
  * @param {Object} [properties] Propiedades del campo.
  * @return {Field}
  */
  static DATE(properties = {}) {
    properties.type = DataTypes.DATE()
    return new Field(properties)
  }

  /**
  * Devuelve una instancia de la clase Field que representa un campo de tipo TIME
  * (string con formato "HH:MM:SS", soporta hasta un máximo de 24 horas).
  * @param {Object} [properties] Propiedades del campo.
  * @return {Field}
  */
  static TIME(properties = {}) {
    properties.type = DataTypes.TIME()
    return new Field(properties)
  }

  /**
  * Devuelve una instancia de la clase Reference que representa una referencia de tipo uno a uno.
  * @param {!Model} model - Modelo al que se hace referencia.
  * @param {Object} [properties={}] Propiedades del campo y de la referencia.
  * @return {Reference}
  */
  static ONE_TO_ONE(model, properties = {}) {
    let key = properties.key ? properties.key : 'id'
    properties.type = model.fields[key].type
    properties.validator = model.fields[key].validator
    properties.description = properties.description || `${model.fields[key].description} del registro '${model.name}'`
    return new Reference(properties, {model:model, as:properties.as, type:Reference.ONE_TO_ONE, key:key})
  }

  /**
  * Devuelve una instancia de la clase Reference que representa una referencia de tipo uno a muchos.
  * @param {!Model} model - Modelo al que se hace referencia.
  * @param {Object} [properties={}] Propiedades del campo y de la referencia.
  * @return {Reference}
  */
  static ONE_TO_MANY(model, properties = {}) {
    let key = properties.key ? properties.key : 'id'
    properties.type = model.fields[key].type
    properties.validator = model.fields[key].validator
    properties.description = properties.description || `${model.fields[key].description} del registro '${model.name}'`
    return new Reference(properties, {model:model, as:properties.as, type:Reference.ONE_TO_MANY, key:key})
  }
}

module.exports = Fields
