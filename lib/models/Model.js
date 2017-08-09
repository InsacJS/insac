'use strict'
<<<<<<< HEAD
const Field = require('./Field')
const DataType = require('./DataType')
const Validator = require('./Validator')

class Model {

  constructor(name, obj) {
    this.name = name
    this.fields = {}
    for (let fieldName in obj.fields) {
      if (obj.fields.hasOwnProperty(fieldName)) {
        let field = obj.fields[fieldName]
        this.fields[fieldName] = (field instanceof Field) ? field : new Field(fieldName, field)
        // Si no cuenta con un validador, se adiciona uno por defecto en base al tipo de dato
        if (typeof this.fields[fieldName].validator == 'undefined') {
          this.fields[fieldName].validator = createValidator(this.fields[fieldName])
        }
      }
    }
    this.options = {}
    if (obj.options) {
      if (obj.options.uniqueKeys) {
        this.options['uniqueKeys'] = obj.options.uniqueKeys
      }
      this.options['timestamps'] = (typeof obj.options.timestamps !== 'undefined') ? obj.options.timestamps : false
      this.options['createdAt'] = (typeof obj.options.createdAt !== 'undefined') ? obj.options.createdAt : '_fecha_creacion'
      this.options['updatedAt'] = (typeof obj.options.updatedAt !== 'undefined') ? obj.options.updatedAt : '_fecha_modificacion'
      // Opcion por defecto
      this.options['freezeTableName'] = true
    }
  }

}

module.exports = Model

function createValidator(field) {
  switch (field.type.name) {
    case DataType.STRING_NAME:
      return Validator.STRING(1, 255)
    case DataType.INTEGER_NAME:
      return Validator.INTEGER
    default:
      throw new Error('No se puede crear el validador, porque no se reconoce el tipo de dato')
  }
}
=======

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

  getPrimayKeys() {
    let fieldsName = [];
    for (let i in this.fields) {
      if (this.fields[i].primaryKey === true) {
        fieldsName.push(this.fields[i].name);
      }
    }
    return fieldsName;
  }

  getForeignKeys() {
    let keys = [];
    let models = [];
    for (let i in this.fields) {
      if (typeof this.fields[i].reference !== 'undefined') {
        keys.push(this.fields[i].name);
        models.push(this.fields[i].reference);
      }
    }
    return [keys, models];
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
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7
