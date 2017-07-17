'use strict'

class Route {

  constructor(uri, method, modelName, idParam, title, version, description, headers, inputs, outputs) {
    this.uri = uri;
    this.method = method;
    this.modelName = modelName;
    this.idParam = idParam;
    this.title = title;
    this.version = version;
    this.description = description;
    this.headers = headers;
    this.inputs = inputs;
    this.outputs = outputs;
  }

  getController(models, database) { }

  static createTitle(method, modelName, idParam) {
    let title;
    switch (method) {
      case 'GET': title = (idParam) ? `Listar ${modelName}` : `Obtener ${modelName}`; break;
      case 'POST': title = `Crear ${modelName}`; break;
      case 'PUT': title = `Actualizar ${modelName}`; break;
      case 'DELETE': title = `Eliminar ${modelName}`; break;
    }
    return title;
  }

  static createDescription(method, modelName, idParam) {
    let description;
    switch (method) {
      case 'GET': description = (idParam) ? `Devuelve un recurso ${modelName}` : `Devuelve una lista de recursos ${modelName}`; break;
      case 'POST': description = `Crea un recurso ${modelName}`; break;
      case 'PUT': description = `Actualiza un recurso ${modelName}`; break;
      case 'DELETE': description = `Elimina un recurso ${modelName}`; break;
    }
    return description;
  }

}

module.exports = Route;
