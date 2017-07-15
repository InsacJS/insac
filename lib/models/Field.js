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

  static idModel() {
    return new Field('id', 'INTEGER', false, true, []);
  }

  static createdAt() {
    return new Field('_fecha_creacion', 'DATE', false, false, []);
  }

  static updatedAt() {
    return new Field('_fecha_modificacion', 'DATE', true, false, []);
  }

  static idUserCreated() {
    return new Field('_id_usuario_creacion', 'DATE', false, false, []);
  }

  static idUserUpdated() {
    return new Field('_id_usuario_modificacion', 'DATE', true, false, []);
  }

}

module.exports = Field;
