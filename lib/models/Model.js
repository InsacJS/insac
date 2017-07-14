'use strict'

class Model {

  constructor(name, pluralName, id, fields, createdAt, updatedAt, idUserCreated, idUserUpdated, options) {
    this.name = name;
    this.pluralName = pluralName;
    this.id = id;
    this.fields = fields;
    this.options = options;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.idUserCreated = idUserCreated;
    this.idUserUpdated = idUserUpdated;
  }

}

module.exports = Model;
