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

function ID(fieldName) {
  let name = fieldName || 'id'
  return new Field(name, {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    validator: Validator.ID,
    description: 'Identificador único'
  })
}

function EMAIL(fieldName) {
  let name = fieldName || 'email'
  return new Field(name, {
    type: DataType.STRING(255),
    validator: Validator.EMAIL,
    description: 'Dirección de correo electrónico'
  })
}

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

const META_COUNT = new Field('count', {
  type: DataType.INTEGER,
  validator: null,
  description: 'Cantidad de registros devueltos'
})

const META_TOTAL = new Field('total', {
  type: DataType.INTEGER,
  validator: null,
  description: 'Cantidad de registros existentes'
})

const META_LIMIT = new Field('limit', {
  type: DataType.INTEGER,
  validator: null,
  description: 'Cantidad máxima de registros a devolver'
})

const META_OFFSET = new Field('offset', {
  type: DataType.INTEGER,
  validator: null,
  description: 'Posición inicial de registros a devolver'
})

const AUTHORIZATION = new Field('authorization', {
  type: DataType.STRING,
  validator: null,
  allowNull: false,
  description: 'Token de acceso'
})

const ACCESS_TOKEN = new Field('access_token', {
  type: DataType.STRING,
  validator: null,
  allowNull: false,
  description: 'Token de acceso'
})

Field.ID = ID
Field.EMAIL = EMAIL
Field.CREATED_AT = CREATED_AT
Field.UPDATED_AT = UPDATED_AT
Field.META_COUNT = META_COUNT
Field.META_TOTAL = META_TOTAL
Field.META_LIMIT = META_LIMIT
Field.META_OFFSET = META_OFFSET
Field.AUTHORIZATION = AUTHORIZATION
Field.ACCESS_TOKEN = ACCESS_TOKEN

module.exports = Field
