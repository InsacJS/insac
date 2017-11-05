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
  * @param {!Object} [association] Propiedades de la asociación.
  */
  constructor(field, reference, association) {
    super(field)

    /**
    * Datos de la referencia.
    * @type {Object}
    * @property {!String} reference.model - Nombre del modelo al que se hace referencia.
    * @property {String} [reference.as] - Nombre del campo (clave foránea) con el que se identificará al modelo de referencia. Por defecto es el mismo nombre del modelo.
    * @property {String} [reference.key='id'] - Clave primaria del modelo al que se hace referencia.
    * @property {String} [reference.foreignKey] - Clave foránea de la asociación.
    */
    this.reference = reference

    /**
    * Datos de la asociación. Desde el punto de vista del modelo al que se hace referencia.
    * @type {Object}
    * @property {!String} association.model - Nombre del modelo al que se hace referencia.
    * @property {String} [association.as] - Nombre del campo con el que se identificará al modelo que lo está referenciando. Por defecto es el nombre en singular del modelo si es de '1:1' y en plural si es de '1:N'.
    * @property {String} association.type - Tipo de asociación. Valores posibles: '1:1' ó '1:N'.
    * @property {String} [reference.foreignKey] - Clave foránea de la asociación.
    */
    this.association = association
  }

  /**
  * Actualiza los valores de las propiedades reference y association.
  * @param {Model} referenceModel Modelo al que se hace referencia.
  * @param {Model} associationModel Modelo que realiza la referencia.
  * @param {String} prop Nombre del campo (clave foránea).
  */
  update(referenceModel, associationModel, prop) {
    this.reference.model = referenceModel.name
    if (!this.reference.as) { this.reference.as = referenceModel.name }
    if (!this.reference.key) { this.reference.key = referenceModel.getPK() }
    if (!this.reference.foreignKey) { this.reference.foreignKey = prop }
    if (this.association) {
      this.association.model = associationModel.name
      if (!this.association.as) {
        this.association.as = associationModel.options[(this.association.type === '1:1') ? 'singular' : 'plural']
      }
      if (!this.association.foreignKey) { this.association.foreignKey = prop }
    }
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
