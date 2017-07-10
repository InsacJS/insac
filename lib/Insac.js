'use strict'
var Send = require('./Send');
var Model = require('./Model');
var Resource = require('./Resource');
var Database = require('./Database');
var Server = require('./Server');
var Middleware = require('./Middleware');

class Insac {

  constructor() {
    // Atributos
    this.models = [];
    this.resources = [];
    this.routes = [];
    this.middlewares = [];
    // Valores por defecto
    this.middlewares['json-parser'] = new Middleware(Middleware.jsonParser());
    this.middlewares['url-encode'] = new Middleware(Middleware.urlEncode());
    this.middlewares['cors'] = new Middleware(Middleware.corsDefault());
    this.middlewares['json-validate'] = new Middleware(Middleware.jsonValidate());
  }

  addModel(model) {
    this.models[model.name] = new Model(model);
  }

  addResource(modelName) {
    this.resources[modelName] = new Resource(this.models[modelName]);
  }

  migrate() {
    new Database(this.models).migrate();
  }

  generateApidoc() {
    console.log(" - Apidoc generated");
  }

  init(port = 3200) {
    let server = new Server(this.models);
    server.middlewares(this.middlewares);
    server.resources(this.resources);
    server.routes(this.routes);
    server.listen(port);
  }

}

module.exports = Insac;
