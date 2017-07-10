var Send = require('./Send');

class Route {

  constructor(route) {
    // Atributos
    this.uri;
    this.method;
    this.model;
    this.title;
    this.version;
    this.description;
    this.params;
    this.input;
    this.output;
    // Valores por defecto
    this.uri = route.uri;
    this.method = route.method;
    this.model = route.model;
    this.title = route.title || (route.method + " " + route.model.name);
    this.version = route.version || 1;
    this.description = route.description || "";
    this.params = route.params || [];
    this.input = route.input || {};
    this.output = route.output || {};
  }

  getController(models, database) {
    if (this.method == 'GET')       {
      if (this.params.includes('id')) {
        return getByIdCtrl(this.model, this.output, models, database)
      } else {
        return getCtrl(this.model, this.output, models, database)
      }
    }
    if (this.method == 'POST')      {return postCtrl(this.model, this.input, models, database)}
    if (this.method == 'PUT')       {return putCtrl(this.model, this.input, models, database)}
    if (this.method == 'PATCH')     {return patchCtrl(this.model, this.input, models, database)}
    if (this.method == 'DELETE')    {return deleteCtrl(this.model, models, database)}
  }

  static finalController(req, res, next) {
    Send.error404(res);
  }

}

module.exports = Route;

function getCtrl(modelName, output, models, database) {
  let controller = function(req, res, next) {
    let options = {};
    database.db.models[modelName].findAll().then(function(data) {
      Send.success200(res, data);
    }).catch(function(err) {
      console.log(err);
      Send.error500(res, err);
    });
  }
  return controller;
}

function getByIdCtrl(modelName, output, models, database) {
  let id = models[modelName].id;
  let controller = function(req, res, next) {
    let options = {where:{}};
    options.where[id] = parseInt(req.params.id);
    database.db.models[modelName].findOne(options).then(function(data) {
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

function postCtrl(modelName, input, models, database) {
  let controller = function(req, res, next) {
    let data = {};
    for (let i in input) {
      let inputTemp = input[i].name;
      data[inputTemp] = req.body[inputTemp];
    }
    database.db.models[modelName].create(data).then(function(data) {
      Send.success201(res, data);
    }).catch(function(err) {
      console.log(err);
      Send.error500(res, err);
    });
  }
  return controller;
}

function putCtrl(modelName, input, models, database) {
  let id = models[modelName].id;
  let controller = function(req, res, next) {
    let data = {};
    for (let i in input) {
      let inputTemp = input[i].name;
      data[inputTemp] = req.body[inputTemp];
    }
    let options = {where:{}};
    options.where[id] = parseInt(req.params.id);
    database.db.models[modelName].update(data, options).then(function(result) {
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

function patchCtrl(modelName, input, models, database) {
  let id = models[modelName].id;
  let controller = function(req, res, next) {
    let data = {};
    for (let i in input) {
      let inputTemp = input[i].name;
      data[inputTemp] = req.body[inputTemp];
    }
    let options = {where:{}};
    options.where[id] = parseInt(req.params.id);
    database.db.models[modelName].update(data, options).then(function(result) {
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

function deleteCtrl(modelName, models, database) {
  let id = models[modelName].id;
  let controller = function(req, res, next) {
    let options = {where:{}};
    options.where[id] = parseInt(req.params.id);
    database.db.models[modelName].destroy(options).then(function(result) {
      if (result > 0) {
        console.log("RESULT = ", result);
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
