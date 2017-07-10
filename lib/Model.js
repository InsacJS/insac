//var DataType = require('./DataType').DataType;

class Model {

  constructor(model) {
    // Atributos
    this.name;
    this.id;
    this.fields = [];
    this.defaultFields = [];

    // Valores por defecto
    this.name = model.name;
    this.id = `id_${model.name}`;
    for (let i in model.fields) {
      this.fields.push({name:model.fields[i], type:"STRING"});
    }
    this.defaultFields.push({name: '_fecha_creacion', type: "DATETIME"});
    this.defaultFields.push({name: '_fecha_modificacion', type: "DATETIME"});
  }

  getAllFields() {
    let allFields = [];
    allFields.push(this.id);
    for (let i in this.fields) {
      allFields.push(this.fields[i].name);
    }
    for (let i in this.defaultFields) {
      allFields.push(this.defaultFields[i].name);
    }
    return allFields;
  }

}

module.exports = Model;
