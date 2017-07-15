'use strict'
var Server = require('./models/Server');
var ServerConfig = require('./models/ServerConfig');
var Database = require('./models/Database');
var DatabaseConfig = require('./models/DatabaseConfig');
var Model = require('./models/Model');
var ModelOptions = require('./models/ModelOptions');
var Validator = require('./models/Validator');
var Field = require('./models/Field');
var Route = require('./models/Route');
var Resource = require('./models/Resource');
var Middleware = require('./models/Middleware');

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

  serverConfig(obj) {
    let port = obj.port || 3200;
    let publicFolder = obj.publicFolder;
    let serverConfig = new ServerConfig(port, publicFolder);
    this.server.setConfig(serverConfig);
  }

  databaseConfig(obj) {
    let username = obj.username;
    let password = obj.password;
    let dbname = obj.dbname;
    let dialect = obj.dialect || 'postgres';
    let timezone = obj.timezone || '+00:00';
    let host = obj.host || 'localhost';
    let port = obj.port || 5432;
    let databaseConfig = new DatabaseConfig(username, password, dbname, dialect, timezone, host, port);
    this.database.setConfig(databaseConfig);
  }

  model(obj) {
    let name = obj.name;
    let pluralName = obj.pluralName || `${name}s`;
    let id = Field.idModel();
    let fields = [];
    if (obj.fields) {
      for (let i in obj.fields) {
        let objField = obj.fields[i];
        if (typeof objField == 'string') {
          let fieldName = objField;
          fields[fieldName] = new Field(fieldName, 'STRING', true, false, []);
          continue;
        }
        let fieldName = objField.name;
        let fieldType = objField.type || 'STRING';
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
    let createdAt = options.timeStamps == true ? Field.createdAt() : null;
    let updatedAt = options.timeStamps == true ? Field.updatedAt() : null;
    let idUserCreated = options.idUserStamps == true ? Field.idUserCreated() : null;
    let idUserUpdated = options.idUserStamps == true ? Field.idUserUpdated() : null;
    this.models[name] = new Model(name, pluralName, id, fields, createdAt, updatedAt, idUserCreated, idUserUpdated, options);
  }

  resource(obj) {
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
        routes.push(new Route(uri, method, modelName, idParam, title, version, description, headers, inputs, outputs));
      }
    }
    this.resources.push(new Resource(modelName, version, routes));
  }

  migrate() {
    this.database.migrate(this.models);
  }

  init() {
    this.database.init(this.models);
    this.server.init(this.models, this.resources, this.middlewares, this.database);
  }

}

module.exports = Insac;

function resourceFromModel(model) {
  let pluralName = model.pluralName;
  let version = 1;
  let routes = [];
  routes.push(Route.generateGET(model));
  routes.push(Route.generateGETID(model));
  routes.push(Route.generatePOST(model));
  routes.push(Route.generatePUT(model));
  routes.push(Route.generateDELETE(model));
  return new Resource(model.name, version, routes);
}
