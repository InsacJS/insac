'use strict'
const DataType = require('./DataType')
const Validator = require('./Validator')

class Field {

  constructor(name, field) {
    this.name = name
    this.type = (typeof field.type == 'function') ? field.type() : field.type
    this.validator = (typeof field.validator == 'function') ? field.validator() : field.validator
    this.description = field.description
    this.allowNull = (typeof field.allowNull != 'indefined') ? field.allowNull : true
    this.unique = (typeof field.unique != 'undefined') ? field.unique : false
    this.primaryKey = (typeof field.primaryKey != 'undefined') ? field.primaryKey : false
    this.autoIncrement = (typeof field.autoIncrement != 'undefined') ? field.autoIncrement : false
    this.reference = field.reference
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

Field.ID = ID

module.exports = Field
