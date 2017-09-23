'use strict'
/** @ignore */ const Fields = require('../tools/Fields')
/** @ignore */ const Reference = require('../fields/Reference')

/**
* Clase que describe las propiedades y comportamiento de un modelo.
*/
class Model {

  /**
  * Crea una instancia de la clase Model.
  * @param {!String} name Nombre del modelo.
  * @param {Object} [properties] Propiedades del modelo.
  */
  constructor(name, properties = {}) {

    /**
    * Nombre del modelo.
    * @type {String}
    */
    this.name = name

    /**
    * Objecto que contiene los campos del modelo.
    * @type {Object}
    */
    this.fields = properties.fields || {}
    // Por defecto se adiciona el campo ID
    if (typeof properties.fields == 'undefined') properties.fields = {}
    if (typeof properties.fields.id == 'undefined') this.fields.id = Fields.ID()

    /**
    * Objeto que contiene algunas opciones extras del modelo.
    * @type {Object} [options]
    * @property {String} [options.singular] - Nombre en singular del modelo.
    * @property {String} [options.plural] - Nombre en plural del modelo.
    * @property {String[]} [options.uniqueKeys=[]] - Nombres de los campos que deben ser únicos.
    * @property {Boolean} [options.timestamps=false] - Habilita los campos createdAt y updatedAt.
    * @property {String} [options.createdAt='_fecha_creacion'] - Nombre del campo createdAt.
    * @property {String} [options.updatedAt='_fecha_modificacion'] - Nombre del campo updatedAt.
    * @property {String} [options.associations=[]] - Listado de nombres de todos los modelos que hacen referencia a este modelo.
    * @property {String} [options.associationsmethods={}] - Coleción de métodos. Funciones que se declaran
    * al momento de crear el modelo y que pueden ser activadas desde los controladores.
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
    if (properties.options) {
      if (typeof properties.options.singular != 'undefined') this.options.singular = properties.options.singular
      if (typeof properties.options.plural != 'undefined') this.options.plural = properties.options.plural
      if (typeof properties.options.uniqueKeys != 'undefined') this.options.uniqueKeys = properties.options.uniqueKeys
      if (typeof properties.options.timestamps != 'undefined') this.options.timestamps = properties.options.timestamps
      if (typeof properties.options.createdAt != 'undefined') this.options.createdAt = properties.options.createdAt
      if (typeof properties.options.updatedAt != 'undefined') this.options.updatedAt = properties.options.updatedAt
    }

    /**
    * Coleción de métodos.
    * @type {Object}
    */
    this.methods = properties.methods || {}

    // Adiciona los campos timestamps, si esta caracteristica esta habilitada.
    if (this.options.timestamps) {
      this.fields[this.options.createdAt] = Fields.CREATED_AT()
      this.fields[this.options.updatedAt] = Fields.UPDATED_AT()
    }
  }

  /**
  * Actualiza el campo options.associations de todos aquellos modelos a los que
  * este referenciando este modelo.
  * @param {Model[]} models Colección de modelos.
  */
  updateModels(models) {
    let nameA = this.name, singular = this.options.singular, plural = this.options.plural
    for (let prop in this.fields) {
      let field = this.fields[prop]
      if (field instanceof Reference) {
        let nameB = field.reference.model
        // Verificamos que el modelo (nameB) no este asociado a este modelo (nameA).
        let existAssociation = false
        for (let i in models[nameB].options.associations) {
          let assoc = models[nameB].options.associations[i]
          if (assoc.model == nameA) {
            existAssociation = true
            break
          }
        }
        // Si el modelo no esta asociado a este modelo (modelA), se la adiciona.
        if (!existAssociation) {
          switch (field.reference.type) {
            case '1:1':
              models[nameB].options.associations.push({model:nameA, as:singular})
              break
            case '1:N':
              models[nameB].options.associations.push({model:nameA, as:plural})
              break
            default:
              throw new Error(`No se reconoce el tipo de referencia '${field.reference.type}' del modelo '${nameA}'`)
          }
        }
      }
    }
  }

  /**
  * Devuelve un objeto que contiene las propiedades para crear modelos sequelize.
  * @return {Object} Contiene los campos name, attributes y options.
  */
  sequelize() {
    let define = { name:this.name, attributes:{}, options:{} }
    // Atributos
    for (let fieldName in this.fields) {
      define.attributes[fieldName] = this.fields[fieldName].sequelize()
    }
    // Crea la propiedad uniqueKeys
    let uniqueKeys = []
    for (let i in this.options.uniqueKeys) {
      let uniqueKey = this.options.uniqueKeys[i]
      if (typeof uniqueKey == 'string') uniqueKeys.push({fields:[uniqueKey]})
      if (Array.isArray(uniqueKey)) uniqueKeys.push({fields:uniqueKey})
    }
    // Opciones
    define.options['singular'] = this.options.singular
    define.options['plural'] = this.options.plural
    define.options['timestamps'] = this.options.timestamps
    define.options['uniqueKeys'] = uniqueKeys
    define.options['createdAt'] = this.options.createdAt
    define.options['updatedAt'] = this.options.updatedAt
    // Opción por defecto
    define.options['freezeTableName'] = true
    return define
  }

  /**
  * Devuelve un objeto de tipo options de sequelize, para realizar consultas,
  * tomando en cuenta la propiedad output de una ruta.
  * @param {Object} output Propiedad output de la ruta.
  * @param {Model[]} models Colección de modelos.
  * @param {Object} db Modelos sequelize, instancia y referencia hacia la clase sequelize.
  */
  queryOptions(output, models, db) {
    output = Array.isArray(output) ? output[0] : output
    let subInclude = this._includeOptions(output, models, db)
    let attributes = this._attributesOptions(output)
    let options = { attributes: attributes }
    if (subInclude.length > 0) {
      options.include = subInclude
    }
    return options
  }

  /**
  * Devuelve una lista con los nombres de todos los fields que se encuentren
  * en la propiedad output de una ruta, si o si se incluyen las claves primarias y foraneas.
  * Esto es para crear la propiedad attributes del objeto options de sequelize.
  * @param {Object} output Objeto que contiene campos de este modelo.
  * @return {String[]}
  */
  _attributesOptions(output) {
    let attributes = []
    for (let fieldName in this.fields) {
      if ((typeof output[fieldName] != 'undefined') || (fieldName.startsWith('id'))) {
        attributes.push(fieldName)
      }
    }
    return attributes
  }

  /**
  * Devuelve una lista de objetos que describen referencias y asociaciones.
  * Esto es para crear la propiedad include del objeto options de sequelize.
  * @param {Object} output Objeto que contiene campos que son referencias o asociaciones.
  * @param {Model[]} models Colección de modelos.
  * @param {Object} db Objeto que contiene todos los modelos sequelize.
  * @return {Object[]} include Objeto que incluye información de los modelos referenciados o asociados.
  * @property {String} include.model - Nombre del modelo.
  * @property {String} include.as - Nombre con el que se declarará en el campo.
  * @property {String} include.attributes - Lista de todos los atributos.
  * @property {String} include.include - Lista con todos los includes, si los tuviera.
  */
  _includeOptions(output, models, db) {
    let include = []
    // Incluye a los modelos hacia abajo (referencias)
    for (let fieldName in this.fields) {
      let field = this.fields[fieldName]
      if (field instanceof Reference) {
        let referenceModelName = field.reference.model
        if (typeof output[referenceModelName] != 'undefined') {
          let referenceOutput = output[referenceModelName]
          let includeElement = {
            model: db[referenceModelName],
            as: models[referenceModelName].options.singular,
            attributes: models[referenceModelName]._attributesOptions(referenceOutput),
          }
          let subIncludeElement = models[referenceModelName]._includeOptions(referenceOutput, models, db)
          if (subIncludeElement.length > 0) includeElement.include = subIncludeElement
          include.push(includeElement)
        }
      }
    }
    // Incluye a los modelos hacia arriba (asociaciones)
    for (let i in this.options.associations) {
      let assoc = this.options.associations[i]
      if (typeof output[assoc.as] != 'undefined') {
        let associationOutput = output[assoc.as]
        if (Array.isArray(associationOutput)) {
          associationOutput = associationOutput[0]
        }
        let includeElement = {
          model: db[assoc.model],
          as: assoc.as,
          attributes: models[assoc.model]._attributesOptions(associationOutput),
        }
        let subIncludeElement = models[assoc.model]._includeOptions(associationOutput, models, db)
        if (subIncludeElement.length > 0) includeElement.include = subIncludeElement
        include.push(includeElement)
      }
    }
    return include
  }

  /**
  * Devuelve un objeto que contiene información acerca del modelo referenciado o asociado a este modelo
  * a partir del nombre del campo.
  * @param {String} prop Nombre con el que posiblemente se identifique una referencia o asociación de este modelo.
  * @param {Model[]} models Colección de modelos.
  * @return {Object} result Objeto que contiene al modelo.
  * @property {Model} result.model Modelo
  * @property {Bolean} result.isArray Indica si el modelo representa un array.
  */
  getModelOfProperty(prop, models) {
    for (let i in this.options.associations) {
      let assoc = this.options.associations[i]
      if (assoc.as == prop) {
        let isArray = (assoc.as != assoc.model)
        return { model:models[assoc.model], isArray:isArray }
      }
    }
    for (let fieldName in this.fields) {
      let field = this.fields[fieldName]
      if (field instanceof Reference) {
        let model = (field.reference.model == prop) ? models[field.reference.model] : undefined
        if (typeof model != 'undefined') {
          return { model:model, isArray:false }
        }
      }
    }
    return { model:undefined, isArray:false }
  }

  /**
  * Devuelve el nombre en singular del modelo al estilo CamelCase.
  * @return {String}
  */
  getName() {
    return this._convertToCamelCase(this.options.singular)
  }

  /**
  * Devuelve el nombre en plural del modelo al estilo CamelCase.
  * @return {String}
  */
  getPluralName() {
    return this._convertToCamelCase(this.options.plural)
  }

  /**
  * Convierte el nombre del modelo al mas puro estilo CamelCase,
  * cada palabra debe estar separada por el caracter '_'
  * @param {String} str Cadena de texto a aconvertir
  * @return {String}
  */
  _convertToCamelCase(str) {
    let result = "", words = str.split('_')
    for (let i in words) {
      result += (words[i].substr(0, 1)).toUpperCase() + words[i].substr(1)
    }
    return result
  }

}

module.exports = Model
