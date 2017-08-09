'use strict'
<<<<<<< HEAD
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
=======
const DataType = require('./Database').DataType;

class Field {

  constructor(name, type, allowNull, unique, validators, upperCase, lowerCase, primaryKey, reference) {
    this.name = name;
    this.type = type;
    this.allowNull = allowNull;
    this.unique = unique;
    this.validators = validators;
    this.upperCase = upperCase;
    this.lowerCase = lowerCase;
    this.primaryKey = primaryKey;
    this.reference = reference;
  }

  getValue(str) {
    switch (this.type) {
      case DataType.INTEGER: return parseInt(str);
      case DataType.STRING:
        str = (this.upperCase) ? str.toUpperCase() : str;
        str = (this.lowerCase) ? str.toLowerCase() : str;
        return str + "";
      case DataType.DATE: return new Date(str);
    }
    return null;
  }

}

module.exports = Field;
module.exports.id = new Field('id', DataType.INTEGER, false, true, [], false, false, true);
module.exports.createdAt = new Field('_fecha_creacion', DataType.DATE, false, false, [], false, false, false);
module.exports.updatedAt = new Field('_fecha_modificacion', DataType.DATE, true, false, [], false, false, false);
module.exports.idUserCreated = new Field('_id_usuario_creacion', DataType.DATE, false, false, [], false, false, false);
module.exports.idUserUpdated = new Field('_id_usuario_modificacion', DataType.DATE, true, false, [], false, false, false);
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7
