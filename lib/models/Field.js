'use strict'
var DataType = require('./Database').DataType;

class Field {

  constructor(name, type, allowNull, unique, validators) {
    this.name = name;
    this.type = type;
    this.allowNull = allowNull;
    this.unique = unique;
    this.validators = validators;
  }

  getValue(str) {
    switch (this.type) {
      case DataType.INTEGER: return parseInt(str);
      case DataType.STRING: return str + "";
      case DataType.DATE: return new Date(str);
    }
    return null
  }

}

module.exports = Field;
module.exports.id = new Field('id', DataType.INTEGER, false, true, []);
module.exports.createdAt = new Field('_fecha_creacion', DataType.DATE, false, false, []);
module.exports.updatedAt = new Field('_fecha_modificacion', DataType.DATE, true, false, []);
module.exports.idUserCreated = new Field('_id_usuario_creacion', DataType.DATE, false, false, []);
module.exports.idUserUpdated = new Field('_id_usuario_modificacion', DataType.DATE, true, false, []);
