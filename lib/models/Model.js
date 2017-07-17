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

  getFieldsName() {
    let fieldsName = [];
    fieldsName.push(this.id.name);
    for (let i in this.fields) {
      fieldsName.push(this.fields[i].name);
    }
    if (this.options.timeStamps) {
      fieldsName.push(this.createdAt.name);
      fieldsName.push(this.updatedAt.name);
    }
    if (this.options.idUserStamps) {
      fieldsName.push(this.idUserCreated.name);
      fieldsName.push(this.idUserUpdated.name);
    }
    return fieldsName;
  }

  getValueParsed(fieldName, str) {
    if (fieldName == this.id.name) {
      return this.id.getValue(str);
    }
    for (let i in this.fields) {
      let field = this.fields[i];
      if (fieldName == field.name) {
        return field.getValue(str);
      }
    }
    if (this.options.timeStamps) {
      if (fieldName == this.createdAt.name) return this.createdAt.getValue(str);
      if (fieldName == this.updatedAt.name) return this.updatedAt.getValue(str);
    }
    if (this.options.idUserStamps) {
      if (fieldName == this.idUserCreated.name) return this.idUserCreated.getValue(str);
      if (fieldName == this.idUserUpdated.name) return this.idUserUpdated.getValue(str);
    }
    return null;
  }

}

module.exports = Model;
