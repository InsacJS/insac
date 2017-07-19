'use strict'
var Config = require('./Config');
var Server = require('./models/Server');
var ServerConfig = require('./models/ServerConfig');
var Database = require('./models/Database');
var DatabaseConfig = require('./models/DatabaseConfig');
var Model = require('./models/Model');
var ModelOptions = require('./models/ModelOptions');
var Validator = require('./models/Validator');
var Field = require('./models/Field');
var Route = require('./models/Route');
var RouteGet = require('./models/RouteGet');
var RoutePost = require('./models/RoutePost');
var RoutePut = require('./models/RoutePut');
var RouteDelete = require('./models/RouteDelete');
var Resource = require('./models/Resource');
var Middleware = require('./models/Middleware');
var Generator = require('./models/Generator');
var Send = require('./models/Send');
var DataType = Database.DataType;

class Insac {

  constructor() {
    this.models = [];
    this.resources = [];
    this.middlewares = [];
    this.middlewares['json-parser'] = new Middleware('json-parser', '/', Middleware.jsonParser());
    this.middlewares['url-encode'] = new Middleware('url-encode', '/', Middleware.urlEncode());
    this.middlewares['cors'] = new Middleware('cors', '/', Middleware.corsDefault());
    this.middlewares['json-validate'] = new Middleware('json-validate', '/', Middleware.jsonValidate());
    this.server = new Server();
    this.database = new Database();
  }

  setConfig(obj) {
    if (typeof obj.response !== 'undefined') {
      if (typeof obj.response.all200 !== 'undefined') Config.response.all200 = obj.response.all200;
      if (typeof obj.response.sendStatus !== 'undefined') Config.response.sendStatus = obj.response.sendStatus;
      if (typeof obj.response.sendCode !== 'undefined') Config.response.sendCode = obj.response.sendCode;
    }
    if (typeof obj.server !== 'undefined') {
      if(obj.server.publicFolder) Config.server.publicFolder = obj.server.publicFolder;
      if(obj.server.port) Config.server.port = obj.server.port;
    }
    if (typeof obj.database !== 'undefined') {
      if(obj.database.dbname) Config.database.dbname = obj.database.dbname;
      if(obj.database.username) Config.database.username = obj.database.username;
      if(obj.database.password) Config.database.password = obj.database.password;
      if(obj.database.dialect) Config.database.dialect = obj.database.dialect;
      if(obj.database.timezone) Config.database.timezone = obj.database.timezone;
      if(obj.database.host) Config.database.host = obj.database.host;
      if(obj.database.port) Config.database.port = obj.database.port;
      this.database.update();
    }
  }

  addModel(obj) {
    let name = obj.name;
    let pluralName = obj.pluralName || `${name}s`;
    let id = Field.id;
    let fields = [];
    if (obj.fields) {
      for (let i in obj.fields) {
        let objField = obj.fields[i];
        if (typeof objField == 'string') {
          let fieldName = objField;
          fields[fieldName] = new Field(fieldName, DataType.STRING, true, false, []);
          continue;
        }
        let fieldName = objField.name;
        let fieldType = objField.type || DataType.STRING;
        let fieldAllowNull = objField.allowNull || true;
        let fieldUnique = objField.unique || false;
        let fieldvalidators = [];
        if (objField.validators) {
          for (let j in objField.validators) {
            let objValidator = objField.validators[j];
            let validatorName = objValidator.name;
            let validatorArgs = objValidator.args;
            let validatorMsg = objValidator.msg || Validator.createMsg(validatorName, validatorArgs, fieldName);
            fieldvalidators[validatorName] = new Validator(validatorName, validatorArgs, validatorMsg);
          }
        }
        // Si no se especifica el tipo, por defecto el tipo es String de 255 caracteres
        // por lo tanto se crea un validador de String entre 1 y 255 caracteres
        if (!objField.type && !fieldvalidators['len']) {
          let validatorName = 'len';
          let validatorArgs = [1,255];
          let validatorMsg = Validator.createMsg(validatorName, validatorArgs, fieldName);
          fieldvalidators[validatorName] = new Validator(validatorName, validatorArgs, validatorMsg);
        }
        fields[fieldName] = new Field(fieldName, fieldType, fieldAllowNull, fieldUnique, fieldvalidators);
      }
    }
    let optionsTimeStamps = true;
    let optionsIdUserStamps = false;
    if (obj.options) {
      let objOptions = obj.options;
      optionsTimeStamps = objOptions.timeStamps || true;
      optionsIdUserStamps = objOptions.idUserStamps || false;
    }
    let options = new ModelOptions(optionsTimeStamps, optionsIdUserStamps);
    let createdAt = options.timeStamps ? Field.createdAt : null;
    let updatedAt = options.timeStamps ? Field.updatedAt : null;
    let idUserCreated = options.idUserStamps ? Field.idUserCreated : null;
    let idUserUpdated = options.idUserStamps ? Field.idUserUpdated : null;
    this.models[name] = new Model(name, pluralName, id, fields, createdAt, updatedAt, idUserCreated, idUserUpdated, options);
  }

  addResource(obj) {
    if (typeof obj == 'string') {
      if (this.models[obj]) {
        let resource = resourceFromModel(this.models[obj]);
        this.resources.push(resource);
        return;
      }
      let msg = `No se encuentra el modelo '${obj}'`;
      throw new Error(msg);
    }
    if (obj.modelName === undefined) {
      let msg = `Se requiere el atributo 'modelName'`;
      throw new Error(msg);
    }
    let modelName = obj.modelName;
    let model = this.models[modelName];
    let pluralName = model.pluralName;
    let version = obj.version || 1;
    let routes = [];
    if (obj.routes) {
      for (let i in obj.routes) {
        let objRoute = obj.routes[i];
        let uri = `/api/v${version}/${pluralName}`;
        let method = objRoute.method;
        let idParam = objRoute.idParam || ((method == 'PUT') || (method == 'DELETE')) ? true : false;
        if (idParam) {uri = `${uri}/:id`;}
        let title = objRoute.title || Route.createTitle(method, modelName, idParam);
        let description = objRoute.description || Route.createDescription(method, modelName, idParam);
        let headers = objRoute.headers || [];
        let inputs = objRoute.inputs || [];
        if (!objRoute.inputs) {
          for (let j in model.fields) {
            inputs.push(model.fields[j].name);
          }
        }
        let outputs = objRoute.outputs || [];
        if (!objRoute.outputs) {
            outputs.push(model.id.name);
          for (let j in model.fields) {
            outputs.push(model.fields[j].name);
          }
          if (model.options.timeStamps) {
            outputs.push(model.createdAt.name);
            outputs.push(model.updatedAt.name);
          }
          if (model.options.idUserStamps) {
            outputs.push(model.idUserCreated.name);
            outputs.push(model.idUserUpdated.name);
          }
        }
        switch (method) {
          case 'GET': routes.push(new RouteGet(uri, modelName, idParam, title, version, description, headers, inputs, outputs)); break;
          case 'POST': routes.push(new RoutePost(uri, modelName, title, version, description, headers, inputs, outputs)); break;
          case 'PUT': routes.push(new RoutePut(uri, modelName, title, version, description, headers, inputs, outputs)); break;
          case 'DELETE': routes.push(new RouteDelete(uri, modelName, title, version, description, headers, inputs, outputs)); break;
        }
      }
    }
    this.resources.push(new Resource(modelName, version, routes));
  }

  migrate(modelsName) {
    let mN = modelsName || [];
    if (modelsName.length == 0) {
      for (let i in this.models) {
        mN.push(this.models[i].name);
      }
    }
    this.database.migrate(this.models, mN);
  }

  init() {
    this.database.init(this.models);
    this.server.init(this.models, this.resources, this.middlewares, this.database);
  }

}

module.exports = Insac;
module.exports.DataType = DataType;

function resourceFromModel(model) {
  let pluralName = model.pluralName;
  let version = 1;
  let routes = [];
  routes.push(Generator.routeGET(model));
  routes.push(Generator.routeGETID(model));
  routes.push(Generator.routePOST(model));
  routes.push(Generator.routePUT(model));
  routes.push(Generator.routeDELETE(model));
  return new Resource(model.name, version, routes);
}
