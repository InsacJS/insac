'use strict'
const DataType = require('./Database').DataType;

class Field {

  constructor(name, type, allowNull, unique, validators, upperCase, lowerCase, primaryKey) {
    this.name = name;
    this.type = type;
    this.allowNull = allowNull;
    this.unique = unique;
    this.validators = validators;
    this.upperCase = upperCase;
    this.lowerCase = lowerCase;
    this.primaryKey = primaryKey;
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
