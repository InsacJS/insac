'use strict'

class Field {

  constructor(name, type, allowNull, unique, validators) {
    this.name = name;
    this.type = type;
    this.allowNull = allowNull;
    this.unique = unique;
    this.validators = validators;
  }

  static idModel() {
    return new Field('id', 'INTEGER', false, true, []);
  }

  static createdAt() {
    return new Field('_fecha_creacion', 'DATETIME', false, false, []});
  }

  static updatedAt() {
    return new Field('_fecha_modificacion', 'DATETIME', true, false, []});
  }

  static idUserCreated() {
    return new Field('_id_usuario_creacion', 'DATETIME', false, false, []});
  }

  static idUserUpdated() {
    return new Field('_id_usuario_modificacion', 'DATETIME', true, false, []});
  }

}

module.exports = Field;
