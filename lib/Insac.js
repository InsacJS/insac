'use strict'
<<<<<<< HEAD
// Importación de modulos externos
const fs = require('fs')
const path = require('path')
// Configuración global
const Config = require('./config/Config')
// Importación de clases
const Server = require('./models/Server')
const Database = require('./models/Database')
const Model = require('./models/Model')
const Route = require('./models/Route')
const Field = require('./models/Field')
const DataType = require('./models/DataType')
const Reference = require('./models/Reference')
const Middleware = require('./models/Middleware')
const Validator = require('./models/Validator')
const Util = require('./models/Util')

// Clase principal que se encarga de controlar toda la aplicación
class Insac {

  // Constructor de la aplicacion
  constructor(config) {
    this.models = []
    this.routes = []
    this.middlewares = []
    this.middlewares.push(Middleware.CORS)
    this.middlewares.push(Middleware.BODY_PARSER)
    this.middlewares.push(Middleware.URL_ENCODED)
    this.middlewares.push(Middleware.JSON_VALIDATE)
    this.updateConfig(config)
    this.server = new Server()
    this.database = new Database()
  }

  // Actualiza la configuración global de la aplicacion
  updateConfig(config) {
    if (config.general) {
      if (config.general.locale) Config.general.locale = config.general.locale
      if (config.general.modelsPath) Config.general.modelsPath = config.general.modelsPath
      if (config.general.routesPath) Config.general.routesPath = config.general.routesPath
    }
    if (config.response) {
      if (config.response.all200) Config.response.all200 = config.response.all200
    }
    if (config.server) {
      if (config.server.publicPath) Config.server.publicPath = config.server.publicPath
      if (config.server.port) Config.server.port = config.server.port
      if (config.server.url) Config.server.url = config.server.url
    }
    if (config.database) {
      if (config.database.dbname) Config.database.dbname = config.database.dbname
      if (config.database.username) Config.database.username = config.database.username
      if (config.database.password) Config.database.password = config.database.password
      if (config.database.dialect) Config.database.dialect = config.database.dialect
      if (config.database.timezone) Config.database.timezone = config.database.timezone
      if (config.database.host) Config.database.host = config.database.host
      if (config.database.port) Config.database.port = config.database.port
    }
  }

  // Crea una nueva aplicación
  static createServer(config) {
    return new Insac(config)
  }

  // Crea un nuevo modelo
  createModel(modelName, options) {
    return new Model(modelName, options)
  }

  // Adiciona un modelo a la aplicación, desde un archivo
  addModel(modelName) {
    let modelFile = require(`${Config.general.modelsPath}/${modelName}`)
    let model = modelFile(this, Field, DataType, Validator, Reference)
    this.models[modelName] = model
  }

  // Crea una nueva ruta
  createRoute(method, path, options) {
    return new Route(method, path, options)
  }

  // Adiciona todas las rutas a la aplicación
  addRoutes() {
    this.addRoutesFromPath(Config.general.routesPath)
  }

  // Adiciona todas las rutas a la aplicación, desde un directorio padre
  addRoutesFromPath(path) {
    if (fs.statSync(path).isDirectory()) {
      fs.readdirSync(path).forEach(file => {
        let newPath = `${path}/${file}`
        this.addRoutesFromPath(newPath)
      })
    } else {
      let routeFile = require(path)
      let routes = routeFile(this, this.models, Field, DataType, Validator, Util)
      for (let i in routes) {
        this.routes.push(routes[i])
      }
    }
  }

  // Crea todas las tablas de la base de datos, a partir de los modelos
  migrate() {
    return this.database.migrate(this.models)
  }

  // Inicia la aplicación
  init() {
    this.database.init(this.models)
    this.server.init(this.models, this.routes, this.middlewares, this.database)
=======
const moment = require('moment');
const Config = require('./Config');
const Server = require('./models/Server');
const Database = require('./models/Database');
const Model = require('./models/Model');
const ModelOptions = require('./models/ModelOptions');
const Validator = require('./models/Validator');
const Field = require('./models/Field');
const Route = require('./models/Route');
const RouteGet = require('./models/RouteGet');
const RoutePost = require('./models/RoutePost');
const RoutePut = require('./models/RoutePut');
const RouteDelete = require('./models/RouteDelete');
const Resource = require('./models/Resource');
const Middleware = require('./models/Middleware');
const Generator = require('./models/Generator');
const Send = require('./models/Send');

const DataType = Database.DataType;

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
    moment.locale(Config.general.locale);
  }

  setConfig(obj) {
    if (typeof obj.general !== 'undefined') {
      if (typeof obj.general.locale !== 'undefined') Config.general.locale = obj.general.locale;
      moment.locale(Config.general.locale);
    }
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
          let fieldType = DataType.STRING;
          let fieldvalidators = [];
          // Se adiciona el validador por defecto de acuerdo al tipo de dato
          let [defaultValidatorName, defaultValidator] = getDefaultValidator(fieldType, fieldName);
          fieldvalidators[defaultValidatorName] = defaultValidator;
          fields[fieldName] = new Field(fieldName, fieldType, true, false, fieldvalidators, false, false, false, undefined);
          continue;
        }
        let fieldName = objField.name;
        let fieldType = objField.type || DataType.STRING;
        let fieldAllowNull = objField.allowNull || true;
        let fieldUnique = objField.unique || false;
        let fieldvalidators = [];
        let fieldUpperCase = objField.upperCase || false;
        let fieldLowerCase = objField.lowerCase || false;
        let fieldPrimaryKey = objField.primaryKey || false;
        let fieldReference = objField.reference || undefined;
        if (typeof fieldReference !== 'undefined') {
          fieldType = Field.id.type;
        }
        // Se adiciona el validador por defecto de acuerdo al tipo de dato
        let [defaultValidatorName, defaultValidator] = getDefaultValidator(fieldType, fieldName);
        fieldvalidators[defaultValidatorName] = defaultValidator;

        // Se adicionan todos los validadores que hayan sido definidas por el desarrollador
        if (objField.validators) {
          for (let j in objField.validators) {
            let objValidator = objField.validators[j];
            let validatorName = objValidator.name;
            let validatorArgs = objValidator.args;
            let validatorMsg = objValidator.msg || Validator.createMsg(validatorName, validatorArgs, fieldName);
            fieldvalidators[validatorName] = new Validator(validatorName, validatorArgs, validatorMsg);
          }
        }
        fields[fieldName] = new Field(fieldName, fieldType, fieldAllowNull, fieldUnique, fieldvalidators, fieldUpperCase, fieldLowerCase, fieldPrimaryKey, fieldReference);
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
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7
  }

}

<<<<<<< HEAD
Insac.Field = Field
Insac.DataType = DataType
Insac.Validator = Validator
Insac.Reference = Reference
Insac.Util = Util

module.exports = Insac
=======
module.exports = Insac;
module.exports.DataType = DataType;

function getDefaultValidator(fieldType, fieldName) {
  // Se adicionan los validadores por defecto, de acuerdo al tipo de dato
  let validatorName, a, b, validatorArgs, validatorMsg;
  switch (fieldType.key) {
    case 'STRING':
      validatorName = 'len';
      a = 1;
      b = (typeof fieldType._length !== 'undefined') ? fieldType._length : 255;
      validatorArgs = [a,b];
      validatorMsg = Validator.createMsg(validatorName, validatorArgs, fieldName);
      break;
    case 'INTEGER':
      validatorName = 'isInt';
      validatorArgs = [undefined, undefined];
      validatorMsg = Validator.createMsg(validatorName, validatorArgs, fieldName);
      break;
    break;
    case 'DATE':
      validatorName = 'isDate';
      validatorArgs = [undefined, undefined];
      validatorMsg = Validator.createMsg(validatorName, validatorArgs, fieldName);
      break;
    break;
    default:
      let msg = `No existe el tipo de dato '${fieldType.key}'`;
      throw new Error(msg);
  }
  return [validatorName, new Validator(validatorName, validatorArgs, validatorMsg)];
}

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
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7
