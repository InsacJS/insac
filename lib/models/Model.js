'use strict'
const Field = require('./Field')
const DataType = require('./DataType')
const Validator = require('./Validator')

class Model {

  constructor(name, obj) {
    this.name = name
    this.fields = {}
    for (let fieldName in obj.fields) {
      if (obj.fields.hasOwnProperty(fieldName)) {
        let field = obj.fields[fieldName]
        this.fields[fieldName] = (field instanceof Field) ? field : new Field(fieldName, field)
        // Si no cuenta con un validador, se adiciona uno por defecto en base al tipo de dato
        if (typeof this.fields[fieldName].validator == 'undefined') {
          this.fields[fieldName].validator = createValidator(this.fields[fieldName])
        }
      }
    }
    this.options = {}
    if (obj.options) {
      if (obj.options.uniqueKeys) {
        this.options['uniqueKeys'] = obj.options.uniqueKeys
      }
      this.options['timestamps'] = (typeof obj.options.timestamps !== 'undefined') ? obj.options.timestamps : false
      this.options['createdAt'] = (typeof obj.options.createdAt !== 'undefined') ? obj.options.createdAt : '_fecha_creacion'
      this.options['updatedAt'] = (typeof obj.options.updatedAt !== 'undefined') ? obj.options.updatedAt : '_fecha_modificacion'
      // Opcion por defecto
      this.options['freezeTableName'] = true
    }
  }

}

module.exports = Model

function createValidator(field) {
  switch (field.type.name) {
    case DataType.STRING_NAME:
      return Validator.STRING(1, 255)
    case DataType.INTEGER_NAME:
      return Validator.INTEGER
    default:
      throw new Error('No se puede crear el validador, porque no se reconoce el tipo de dato')
  }
}
