'use strict'
const DataType = require('./DataType')
const Validator = require('./Validator')

class Field {

  constructor(name, field) {
    if ((typeof name == 'object') && (typeof field == 'undefined')) {
      name = 'default'
      field = name
    }
    this.name = name
    this.type = (typeof field.type == 'function') ? field.type() : field.type
    this.validator = (typeof field.validator == 'function') ? field.validator() : field.validator
    this.description = field.description
    this.allowNull = (typeof field.allowNull != 'undefined') ? field.allowNull : true
    this.unique = (typeof field.unique != 'undefined') ? field.unique : false
    this.primaryKey = (typeof field.primaryKey != 'undefined') ? field.primaryKey : false
    this.autoIncrement = (typeof field.autoIncrement != 'undefined') ? field.autoIncrement : false
    this.reference = field.reference
    this.defaultValue = field.defaultValue
  }

}

const ID = new Field('id', {
  type: DataType.INTEGER,
  allowNull: false,
  primaryKey: true,
  autoIncrement: true,
  validator: Validator.ID,
  description: 'Identificador único'
})

const CREATED_AT = new Field('createdAt', {
  type: DataType.DATE,
  validator: null,
  description: 'Fecha de creación'
})

const UPDATED_AT = new Field('updatedAt', {
  type: DataType.DATE,
  validator: null,
  description: 'Fecha de modificación'
})

Field.ID = ID
Field.CREATED_AT = CREATED_AT
Field.UPDATED_AT = UPDATED_AT

module.exports = Field
