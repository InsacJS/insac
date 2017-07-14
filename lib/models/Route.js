'use strict'
var Send = require('./Send');

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

  getController(models, database) {
    switch (this.method) {
      case 'GET': return this.idParam ? getControllerGETID(models, database, this.modelName, this.outputs) : getControllerGET(models, database, this.modelName, this.outputs);
      case 'POST': return getControllerPOST(models, database, this.modelName, this.inputs);
      case 'PUT': return getControllerPUT(models, database, this.modelName, this.inputs);
      case 'DELETE': return getControllerDELETE(models, database, this.modelName);
    }
  }

  static createTitle(method, modelName, idParam) {
    let title;
    switch (this.method) {
      case 'GET': title = (idParam) ? `Listar ${modelName}` : `Obtener ${modelName}`; break;
      case 'POST': title = `Crear ${modelName}`; break;
      case 'PUT': title = `Actualizar ${modelName}`; break;
      case 'DELETE': title = `Eliminar ${modelName}`; break;
    }
    return title;
  }

  static createDescription(method, modelName, idParam) {
    let description;
    switch (this.method) {
      case 'GET': description = (idParam) ? `Devuelve un recurso ${modelName}` : `Devuelve una lista de recursos ${modelName}`; break;
      case 'POST': description = `Crea un recurso ${modelName}`; break;
      case 'PUT': description = `Actualiza un recurso ${modelName}`; break;
      case 'DELETE': description = `Elimina un recurso ${modelName}`; break;
    }
    return description;
  }

  static generateGET(model) {
    let uri = `/api/v1/${model.pluralName}`;
    let method = 'GET';
    let modelName = model.name;
    let idParam = false;
    let title = Route.createTitle(method, modelName, idParam);
    let version = 1;
    let descripction = Route.createDescription(method, modelName, idParam);
    let headers = [];
    let inputs = [];
    let outputs = [];
    outputs.push(model.id.name);
    for (let i in model.fields) {
      outputs.push(model.fields[i].name);
    }
    if (model.options.timeStamps) {
      outputs.push(model.createdAt.name);
      outputs.push(model.updatedAt.name);
    }
    if (model.options.idUserStamps) {
      outputs.push(model.idUserCreated.name);
      outputs.push(model.idUserUpdated.name);
    }
    return new Route(uri, method, modelName, idParam, title, version, description, headers, inputs, outputs);
  }

  static generateGETID(model) {
    let uri = `/api/v1/${model.pluralName}/:id`;
    let method = 'GET';
    let modelName = model.name;
    let idParam = true;
    let title = Route.createTitle(method, modelName, idParam);
    let version = 1;
    let descripction = Route.createDescription(method, modelName, idParam);
    let headers = [];
    let inputs = [];
    let outputs = [];
    outputs.push(model.id.name);
    for (let i in model.fields) {
      outputs.push(model.fields[i].name);
    }
    if (model.options.timeStamps) {
      outputs.push(model.createdAt.name);
      outputs.push(model.updatedAt.name);
    }
    if (model.options.idUserStamps) {
      outputs.push(model.idUserCreated.name);
      outputs.push(model.idUserUpdated.name);
    }
    return new Route(uri, method, modelName, idParam, title, version, description, headers, inputs, outputs);
  }

  static generatePOST(model) {
    let uri = `/api/v1/${model.pluralName}`;
    let method = 'POST';
    let modelName = model.name;
    let idParam = false;
    let title = Route.createTitle(method, modelName, idParam);
    let version = 1;
    let descripction = Route.createDescription(method, modelName, idParam);
    let headers = [];
    let inputs = [];
    for (let i in model.fields) {
      inputs.push(model.fields[i].name);
    }
    let outputs = [];
    return new Route(uri, method, modelName, idParam, title, version, description, headers, inputs, outputs);
  }

  static generatePUT(model) {
    let uri = `/api/v1/${model.pluralName}/:id`;
    let method = 'PUT';
    let modelName = model.name;
    let idParam = true;
    let title = Route.createTitle(method, modelName, idParam);
    let version = 1;
    let descripction = Route.createDescription(method, modelName, idParam);
    let headers = [];
    let inputs = [];
    for (let i in model.fields) {
      inputs.push(model.fields[i].name);
    }
    let outputs = [];
    return new Route(uri, method, modelName, idParam, title, version, description, headers, inputs, outputs);
  }

  static generateDELETE(model) {
    let uri = `/api/v1/${model.pluralName}/:id`;
    let method = 'DELETE';
    let modelName = model.name;
    let idParam = true;
    let title = Route.createTitle(method, modelName, idParam);
    let version = 1;
    let descripction = Route.createDescription(method, modelName, idParam);
    let headers = [];
    let inputs = [];
    let outputs = [];
    return new Route(uri, method, modelName, idParam, title, version, description, headers, inputs, outputs);
  }

}

module.exports = Route;

function getControllerGET(models, database, modelName, outputs) {
  let controller = function(req, res, next) {
    let options = {};
    database.seqModels[modelName].findAll().then(function(data) {
      Send.success200(res, data);
    }).catch(function(err) {
      console.log(err);
      Send.error500(res, err);
    });
  }
  return controller;
}

function getControllerGETID(models, database, modelName, outputs) {
  let id = models[modelName].id.name;
  let controller = function(req, res, next) {
    let options = {where:{}};
    options.where[id] = parseInt(req.params.id);
    database.seqModels[modelName].findOne(options).then(function(data) {
      if (data) {
        return Send.success200(res, data);
      }
      Send.error404(res);
    }).catch(function(err) {
      console.log(err);
      Send.error500(res, err);
    });
  }
  return controller;
}

function getControllerPOST(models, database, modelName, inputs) {
  let controller = function(req, res, next) {
    let data = {};
    for (let i in inputs) {
      let input = inputs[i];
      data[input] = req.body[input];
    }
    database.seqModels[modelName].create(data).then(function(data) {
      Send.success201(res, data);
    }).catch(function(err) {
      console.log(err);
      Send.error500(res, err);
    });
  }
  return controller;
}

function getControllerPUT(models, database, modelName, inputs) {
  let id = models[modelName].id.name;
  let controller = function(req, res, next) {
    let data = {};
    for (let i in inputs) {
      let input = inputs[i];
      data[input] = req.body[input];
    }
    let options = {where:{}};
    options.where[id] = parseInt(req.params.id);
    database.seqModels[modelName].update(data, options).then(function(result) {
      let nroRowAffecteds = result[0];
      if (nroRowAffecteds > 0) {
        return Send.success200(res);
      }
      Send.error404(res);
    }).catch(function(err) {
      console.log(err);
      Send.error500(res, err);
    });
  }
  return controller;
}

function getControllerDELETE(models, database, modelName) {
  let id = models[modelName].id.name;
  let controller = function(req, res, next) {
    let options = {where:{}};
    options.where[id] = parseInt(req.params.id);
    database.seqModels[modelName].destroy(options).then(function(result) {
      if (result > 0) {
        return Send.success200(res);
      }
      Send.error404(res);
    }).catch(function(err) {
      console.log(err);
      Send.error500(res, err);
    });
  }
  return controller;
}
