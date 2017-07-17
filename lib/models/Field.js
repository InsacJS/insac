'use strict'

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
      case 'INTEGER': return parseInt(str);
      case 'STRING': return str + "";
      case 'DATE': return new Date(str);
    }
    return null
  }

}

module.exports = Field;
module.exports.id = new Field('id', 'INTEGER', false, true, []);
module.exports.createdAt = new Field('_fecha_creacion', 'DATE', false, false, []);
module.exports.updatedAt = new Field('_fecha_modificacion', 'DATE', true, false, []);
module.exports.idUserCreated = new Field('_id_usuario_creacion', 'DATE', false, false, []);
module.exports.idUserUpdated = new Field('_id_usuario_modificacion', 'DATE', true, false, []);
