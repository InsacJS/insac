'use strict'
var async = require('async');
var Send = require('./Send');
var Validator = require('./Validator');

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
      case 'GET': return this.idParam ? this.getControllerGETID(models, database) : this.getControllerGET(models, database);
      case 'POST': return this.getControllerPOST(models, database);
      case 'PUT': return this.getControllerPUT(models, database);
      case 'DELETE': return this.getControllerDELETE(models, database);
    }
  }

  getControllerGET(models, database) {
    let modelName = this.modelName;
    let outputs = this.outputs;
    let controller = function(req, res, next) {
      let asycFunctions = [];
      let data;
      // Función GET
      let funcGet = function(callback) {
        let options = optionsGet(req, modelName, models, outputs);
        database.seqModels[modelName].findAll(options).then(function(dataR) {
          data = dataR;
          return callback(null);
        }).catch(function(err) {
          return callback({code:500, msg:err});
        });
      };
      asycFunctions.push(funcGet);

      async.waterfall(asycFunctions, function(err, result) {
        if (err) {
          switch (err.code) {
            case 404: return Send.error404(res); break;
            case 422: return Send.error422(res, err.msg, err.value); break;
            case 500: console.log("ERROR ", err.msg); return Send.error500(res); break;
          }
        }
        Send.success200(res, data);
      });
    }
    return controller;
  }

  getControllerGETID(models, database) {
    let modelName = this.modelName;
    let outputs = this.outputs;
    let controller = function(req, res, next) {
      let asycFunctions = [];
      let data;

      // Función VAL ID
      let funcIdValidate = Validator.funcIdValidate(req.params.id);
      asycFunctions.push(funcIdValidate);

      // Función GET
      let funcGet = function(callback) {
        let options = optionsGetById(req, modelName, models, outputs);
        database.seqModels[modelName].findOne(options).then(function(dataR) {
          if (dataR) {
            data = dataR;
            return callback(null);
          }
          return callback({code:404});
        }).catch(function(err) {
          return callback({code:500, msg:err});
        });
      };
      asycFunctions.push(funcGet);

      async.waterfall(asycFunctions, function(err, result) {
        if (err) {
          switch (err.code) {
            case 404: return Send.error404(res); break;
            case 422: return Send.error422(res, err.msg, err.value); break;
            case 500: console.log("ERROR ", err.msg); return Send.error500(res); break;
          }
        }
        Send.success200(res, data);
      });
    }
    return controller;
  }

  getControllerPOST(models, database) {
    let modelName = this.modelName;
    let model = models[modelName];
    let inputs = this.inputs;
    let controller = function(req, res, next) {
      let asycFunctions = [];

      for (let i in inputs) {
        let input = inputs[i];
        if (req.body[input]) {
          let field = model.fields[input];
          for (let j in field.validators) {
            let validator = field.validators[j];
            // Función VAL FIELD
            let funcFieldValidate = validator.funcValidate(req.body[input]);
            asycFunctions.push(funcFieldValidate);
          }
        } else {
          // Función FIELD NOT FOUND
          let funcFieldNotFoundValidate = Validator.funcFieldNotFoundValidate(input, req.body[input]);
          asycFunctions.push(funcFieldNotFoundValidate);
        }
      }
      // Construir DATA
      let data = {};
      for (let i in inputs) {
        let input = inputs[i];
        data[input] = model.getValueParsed(input, req.body[input]);
      }
      // Función POST
      let funcPost = function(callback) {
        database.seqModels[modelName].create(data).then(function(data) {
          return callback(null, data);
        }).catch(function(err) {
          return callback({code:500, msg:err});
        });
      };
      asycFunctions.push(funcPost);

      async.waterfall(asycFunctions, function(err, result) {
        if (err) {
          switch (err.code) {
            case 404: return Send.error404(res); break;
            case 422: return Send.error422(res, err.msg, err.value); break;
            case 500: console.log("ERROR ", err.msg); return Send.error500(res); break;
          }
        }
        Send.success201(res, result);
      });
    }
    return controller;
  }

  getControllerPUT(models, database) {
    let modelName = this.modelName;
    let model = models[modelName];
    let inputs = this.inputs;
    let controller = function(req, res, next) {
      let asycFunctions = [];

      // Función VAL ID
      let funcIdValidate = Validator.funcIdValidate(req.params.id);
      asycFunctions.push(funcIdValidate);

      let validInputs = [];
      for (let i in inputs) {
        let input = inputs[i];
        if (req.body[input]) {
          validInputs.push(input);
          let field = model.fields[input];
          for (let j in field.validators) {
            let validator = field.validators[j];
            // Función VAL FIELD
            let funcFieldValidate = validator.funcValidate(req.body[input]);
            asycFunctions.push(funcFieldValidate);
          }
        }
      }
      if (validInputs.length == 0) {
        // Función VAL UNIQUE FIELD
        let funcFieldRequire = Validator.funcFieldRequire();
        asycFunctions.push(funcFieldRequire);
      }

      // Construir DATA
      let data = {};
      for (let i in validInputs) {
        let input = validInputs[i];
        data[input] = model.getValueParsed(input, req.body[input]);
      }
      // Función PUT
      let funcPut = function(callback) {
        let options = optionsPut(req);
        database.seqModels[modelName].update(data, options).then(function(result) {
          let nroRowAffecteds = result[0];
          if (nroRowAffecteds > 0) {
            return callback(null);
          }
          return callback({code:404});
        }).catch(function(err) {
          return callback({code:500, msg:err});
        });
      };
      asycFunctions.push(funcPut);

      async.waterfall(asycFunctions, function(err, result) {
        if (err) {
          switch (err.code) {
            case 404: return Send.error404(res); break;
            case 422: return Send.error422(res, err.msg, err.value); break;
            case 500: console.log("ERROR ", err.msg); return Send.error500(res); break;
          }
        }
        Send.success201(res, result);
      });
    }
    return controller;
  }

  getControllerDELETE(models, database) {
    let modelName = this.modelName;
    let model = models[modelName];
    let controller = function(req, res, next) {
      let asycFunctions = [];

      // Función VAL ID
      let funcIdValidate = Validator.funcIdValidate(req.params.id);
      asycFunctions.push(funcIdValidate);

      // Función DELETE
      let funcDelete = function(callback) {
        let options = optionsDelete(req);
        database.seqModels[modelName].destroy(options).then(function(result) {
          if (result > 0) {
            return callback(null);
          }
          return callback({code:404});
        }).catch(function(err) {
          return callback({code:500, msg:err});
        });
      };
      asycFunctions.push(funcDelete);

      async.waterfall(asycFunctions, function(err, result) {
        if (err) {
          switch (err.code) {
            case 404: return Send.error404(res); break;
            case 422: return Send.error422(res, err.msg, err.value); break;
            case 500: console.log("ERROR ", err.msg); return Send.error500(res); break;
          }
        }
        Send.success201(res, result);
      });
    }
    return controller;
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
    let description = Route.createDescription(method, modelName, idParam);
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
    let description = Route.createDescription(method, modelName, idParam);
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
    let description = Route.createDescription(method, modelName, idParam);
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
    let description = Route.createDescription(method, modelName, idParam);
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
    let description = Route.createDescription(method, modelName, idParam);
    let headers = [];
    let inputs = [];
    let outputs = [];
    return new Route(uri, method, modelName, idParam, title, version, description, headers, inputs, outputs);
  }

}

module.exports = Route;

function optionsGetById(req, modelName, models, outputs) {
  let model = models[modelName];
  let idName = model.id.name;
  let fieldsName = model.getFieldsName();
  // Incluimos el filtro por id
  let options = {};
  options.where = {};
  options.where[idName] = parseInt(req.params.id);
  // Incluimos los outputs válidos
  for (let i in outputs) {
    let out = outputs[i];
    for (let j in fieldsName) {
      let fieldName = fieldsName[j];
      if (out == fieldName) {
        if (!options.attributes) {
          options.attributes = [];
        }
        options.attributes.push(out);
        break;
      }
    }
  }
  //Incluimos todos los filtros disponibles (resource?fields=name,year,etc)
  let query = req.query;
  let queryFields = query.fields ? query.fields.split(",") : ['all'];
  options.attributes = [];
  for (let i in queryFields) {
    let queryField = queryFields[i];
    for (let j in fieldsName) {
      let fieldName = fieldsName[j];
      if ((queryField == 'all') || (queryField == fieldName)) {
        options.attributes.push(fieldName);
      }
    }
  }

  return options;
}

function optionsGet(req, modelName, models, outputs) {
  let model = models[modelName];
  let idName = model.id.name;
  let fieldsName = model.getFieldsName();

  let query = req.query;

  let options = {};
  options.offset = query.offset ? parseInt(query.offset) : 0; // ?offset=1
  options.limit = query.limit ? parseInt(query.limit) : 50; // ?limit=10

  // Incluimos los outputs válidos
  for (let i in outputs) {
    let out = outputs[i];
    for (let j in fieldsName) {
      let fieldName = fieldsName[j];
      if (out == fieldName) {
        if (!options.attributes) {
          options.attributes = [];
        }
        options.attributes.push(out);
        break;
      }
    }
  }
  // Filtro 'fields'
  let queryFields = query.fields ? query.fields.split(",") : ['all'];
  options.attributes = [];
  for (let i in queryFields) {
    let queryField = queryFields[i];
    for (let j in fieldsName) {
      let fieldName = fieldsName[j];
      if ((queryField == 'all') || (queryField == fieldName)) {
        options.attributes.push(fieldName);
      }
    }
  }
  // Filtro 'where'
  for (let i in fieldsName) {
    let fieldName = fieldsName[i];
    if (query[fieldName]) {
      if (!options.where) {
        options.where = {};
      }
      options.where[fieldName] = model.getValueParsed(fieldName, query[fieldName]);
    }
  }
  // Filtro 'sort'
  let querySorts = query.sort ? query.sort.split(",") : ['id asc'];
  for (let i in querySorts) {
    let [sortFieldName, orderType] = querySorts[i].split(" ");
    if (!sortFieldName || !orderType) {
      continue;
    }
    if ((orderType.toLowerCase() == 'asc') || (orderType.toLowerCase() == 'desc')) {
      for (let j in fieldsName) {
        let fieldName = fieldsName[j];
        if (sortFieldName == fieldName) {
          if (!options.order) options.order = [];
          options.order.push([fieldName, orderType.toLowerCase()]);
          break;
        }
      }
    }
  }

  return options;
}

function optionsPut(req) {
  let options = {};
  options.where = {
    id: parseInt(req.params.id)
  }
  return options;
}

function optionsDelete(req) {
  let options = {};
  options.where = {
    id: parseInt(req.params.id)
  }
  return options;
}
