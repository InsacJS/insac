var Route = require('./Route');
var Send = require('./Send');

class Resource {

  constructor(model) {
    // Atributos
    this.model;
    // Valores por defecto
    this.model = model;
  }

  getRoutes() {
    let routes = [];
    routes.push(new Route(generateGet(this.model)));
    routes.push(new Route(generateGetById(this.model)));
    routes.push(new Route(generatePost(this.model)));
    routes.push(new Route(generatePut(this.model)));
    routes.push(new Route(generatePatch(this.model)));
    routes.push(new Route(generateDelete(this.model)));
    return routes;
  }

}

module.exports = Resource;

function generateGet(model) {
  let route = {
    uri: `/${model.name}`,
    method: "GET",
    model: model.name,
    title: `Listar ${model.name}`,
    version: 1,
    description: `Devuelve una lista de ${model.name}.`,
    output: {model:model.name, fields: model.getAllFields()}
  };
  return route;
}

function generateGetById(model) {
  let route = {
    uri: `/${model.name}/:id`,
    method: "GET",
    model: model.name,
    title: `Obtener ${model.name}`,
    version: 1,
    description: `Devuelve un ${model.name}.`,
    params: ['id'],
    output: {model:model.name, fields: model.getAllFields()}
  };
  return route;
}

function generatePost(model) {
  let route = {
    uri: `/${model.name}`,
    method: "POST",
    model: model.name,
    title: `Crear ${model.name}`,
    version: 1,
    description: `Crea un ${model.name}.`,
    input: model.fields,
    output: {model:model.name, fields: model.getAllFields()}
  };
  return route;
}

function generatePut(model) {
  let route = {
    uri: `/${model.name}/:id`,
    method: "PUT",
    model: model.name,
    title: `Actualizar ${model.name}`,
    version: 1,
    description: `Actualiza un ${model.name}.`,
    params: ['id'],
    input: model.fields
  };
  return route;
}

function generatePatch(model) {
  let route = {
    uri: `/${model.name}/:id`,
    method: "PATCH",
    model: model.name,
    title: `Actualizar ${model.name} parcial`,
    version: 1,
    description: `Actualiza un ${model.name}.`,
    params: ['id'],
    input: model.fields
  };
  return route;
}

function generateDelete(model) {
  let route = {
    uri: `/${model.name}/:id`,
    method: "DELETE",
    model: model.name,
    title: `Eliminar ${model.name}`,
    version: 1,
    description: `Elimina un ${model.name}.`,
    params: ['id'],
    input: model.fields
  };
  return route;
}
