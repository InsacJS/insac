'use strict'
/** @ignore */ const Field = require('./Field')
/** @ignore */ const Reference = require('./Reference')

/**
* Describe un modelo que representa a una tabla de la base de datos, definiendo sus caracteristicas y comportamiento.
*/
class Model {

  /**
  * Crea una instancia de la clase Model.
  * @param {!String} name - Nombre del modelo.
  * @param {Object} [model={}] - Datos del modelo. Por defecto crea un modelo con el campo ID.
  * @param {Object} [model.fields] - Campos del modelo. Objeto de contiene pares clave valor, cada par representa un campo, el valor de una clave puede ser de tipo Field o un Objeto. Por defecto se adiciona el campo ID si no se lo hubiera declarado
  * @param {Object} [model.options] - Opciones del modelo.
  * @param {String} [model.options.singular] - Nombre en singular del modelo. Por defecto es el mismo nombre del modelo.
  * @param {String} [model.options.plural] - Nombre en plural del modelo. Por defecto es el mismo nombre del modelo seguido de una s.
  * @param {String[]} [model.options.uniqueKeys=[]] - Contiene los nombres de los campos que deben ser únicos.
  * @param {Boolean} [model.options.timestamps=false] - Indica si se adicionarán los campos createdAt y updatedAt al modelo.
  * @param {String} [model.options.createdAt='_fecha_creacion'] - Nombre del campo createdAt.
  * @param {String} [model.options.createdAt='_fecha_modificacion'] - Nombre del campo updatedAt.
  * @param {Object[]} [model.options.associations=[]] - Listado de nombres de todos los modelos que hacen referencia a este modelo. Este valor se asigna automáticamente cuando otro modelo lo referencia.
  * @param {String} [model.options.associations[].model] - Nombre del modelo que lo referencia.
  * @param {String} [model.options.associations[].as] - Nombre con el que se identificará el modelo que establece la referencia.
  */
  constructor(name, model = {}) {
    /**
    * Nombre del modelo.
    * @type {String}
    */
    this.name = name

    /**
    * Objecto que contiene los campos del modelo
    * @type {Object}
    */
    this.fields = {}
    // Por defecto se adiciona el campo ID
    if (!model.fields) model.fields = {}
    if (!model.fields.id) this.fields.id = Field.ID()
    for (let fieldName in model.fields) {
      let field = model.fields[fieldName]
      this.fields[fieldName] = (field instanceof Field) ? field : new Field(field)
      // Se actualiza el nombre del campo
      this.fields[fieldName].name = fieldName
    }

    /**
    * Objeto que contiene algunas opciones extras del modelo
    * @type {Object} [options]
    * @property {String} [options.singular] - Nombre en singular del modelo.
    * @property {String} [options.plural] - Nombre en plural del modelo.
    * @property {String[]} [options.uniqueKeys=[]] - Nombres de los campos que deben ser únicos
    * @property {Boolean} [options.timestamps=false] - Habilita los campos createdAt y updatedAt.
    * @property {String} [options.createdAt='_fecha_creacion'] - Nombre del campo createdAt.
    * @property {String} [options.updatedAt='_fecha_modificacion'] - Nombre del campo updatedAt.
    * @property {String} [options.associations=[]] - Listado de nombres de todos los modelos que hacen referencia a este modelo.
    */
    this.options = {
      singular: this.name,
      plural: `${this.name}s`,
      uniqueKeys: [],
      timestamps: false,
      createdAt: '_fecha_creacion',
      updatedAt: '_fecha_modificacion',
      associations: []
    }
    if (model.options) {
      if (model.options.singular) this.options.singular = model.options.singular
      if (model.options.plural) this.options.plural = model.options.plural
      if (model.options.uniqueKeys) this.options.uniqueKeys = model.options.uniqueKeys
      if (typeof model.options.timestamps != 'undefined') this.options.timestamps = model.options.timestamps
      if (model.options.createdAt) this.options.createdAt = model.options.createdAt
      if (model.options.updatedAt) this.options.updatedAt = model.options.updatedAt
    }
  }

  /**
  * Devuelve un objeto para crear modelos sequelize
  * @return {Object} Contiene los campos name, attributes y options
  */
  sequelize() {
    let define = { name:this.name, attributes:{}, options:{} }
    // Atributos
    for (let i in this.fields) {
      define.attributes[this.fields[i].name] = this.fields[i].sequelize()
    }
    // Opciones
    define.options['singular'] = this.options.singular
    define.options['plural'] = this.options.plural
    define.options['timestamps'] = this.options.timestamps
    define.options['uniqueKeys'] = this._sequelizeOptionsUnique()
    define.options['createdAt'] = this.options.createdAt
    define.options['updatedAt'] = this.options.updatedAt
    // Opción por defecto
    define.options['freezeTableName'] = true
    return define
  }

  /**
  * Devuelve la opción uniqueKeys para un modelo sequelize (SequelizeModel).
  * @return {Object}
  */
  _sequelizeOptionsUnique() {
    let sequelizeOptionsUnique = []
    for (let i in this.options.uniqueKeys) {
      let uniqueKey = this.options.uniqueKeys[i]
      if (typeof uniqueKey == 'string') sequelizeOptionsUnique.push({fields:[uniqueKey]})
      if (Array.isArray(uniqueKey)) sequelizeOptionsUnique.push({fields:uniqueKey})
    }
    return sequelizeOptionsUnique
  }

  // Devuelve una lista de todos los atributos.
  attributesOptions(output) {
    let attributes = []
    for (let fieldName in output) {
      if ((typeof this.fields[fieldName] != 'undefined') && (typeof output[fieldName] != 'undefined')) {
        attributes.push(fieldName)
      } else if (fieldName == 'id') {
        attributes.push(fieldName)
      }
    }
    return attributes
  }

  // Devuelve una lista de todos los includes.
  includeOptions(output, models, db) {
    //console.log("-----------OUTPUT for ", this.name, " = ", output)
    let include = []
    // Incluye a los modelos hacia abajo
    for (let fieldName in this.fields) {
      let field = this.fields[fieldName]
      // Verifica si el campo es una referencia
      if (field instanceof Reference) {
        let referenceModelName = field.reference.model
        // Verifica que la referencia se encuentre en el output
        if (typeof output[referenceModelName] != 'undefined') {
          let referenceOutput = field.referenceOutput(output)
          let includeElement = {
            model: db[referenceModelName],
            as: models[referenceModelName].options.singular,
            attributes: models[referenceModelName].attributesOptions(referenceOutput),
          }
          let subIncludeElement = models[referenceModelName].includeOptions(referenceOutput, models, db)
          if (subIncludeElement.length > 0) includeElement.include = subIncludeElement
          //console.log("THIS MODEL = ", this.name, "SUB INCLUDE = ", includeElement, " model: ", db[referenceModelName])
          include.push(includeElement)
        }
      }
    }
    // Incluye a los modelos hacia arriba
    for (let i in this.options.associations) {
      let assoc = this.options.associations[i]
      //console.log("ASSOC = ", assoc, " model = ", this.name)
      //console.log("value: ", output[assoc.as])

      if (typeof output[assoc.as] != 'undefined') {
        let associationOutput = output[assoc.as]
        if (Array.isArray(associationOutput)) {
          associationOutput = associationOutput[0]
        }
        let includeElement = {
          model: db[assoc.model],
          as: assoc.as,
          attributes: models[assoc.model].attributesOptions(associationOutput),
        }
        let subIncludeElement = models[assoc.model].includeOptions(associationOutput, models, db)
        if (subIncludeElement.length > 0) includeElement.include = subIncludeElement
        //console.log("THIS MODEL = ", this.name, "SUB INCLUDE = ", includeElement, " model: ", db[referenceModelName])
        include.push(includeElement)
      }
    }
    return include
  }

  attributesString() {
    let attribs = ""
    for (let i in this.fields) {
      attribs += `,${this.fields[i].name}`
    }
    return attribs.substr(1)
  }

}

module.exports = Model
