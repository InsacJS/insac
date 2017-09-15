'use strict'
/** @ignore */ const Field = require('./Field')

/** @ignore */ const ONE_TO_ONE = '1:1'
/** @ignore */ const ONE_TO_MANY = '1:N'

/**
* Describe un campo que hace referencia a otra tabla.
* @extends {Field}
*/
class Reference extends Field {

  /**
  * Crea una instancia de la clase Reference.
  * @param {!Object} field Propiedades del campo.
  * @param {!Object} reference Propiedades de la referencia.
  */
  constructor(field, reference) {
    super(field)
    let model = reference.model
    let type = reference.type || Reference.ONE_TO_ONE
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
  * Devuelve un objeto que contiene las propiedades para crear un objeto de tipo SequelizeField.
  * @return {Object} Propiedades para crear un objeto de tipo SequelizeField.
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

}

Reference.ONE_TO_ONE = ONE_TO_ONE
Reference.ONE_TO_MANY = ONE_TO_MANY

module.exports = Reference
