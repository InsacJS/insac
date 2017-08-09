'use strict'
const Route = require('./Route');
const RouteGet = require('./RouteGet');
const RoutePost = require('./RoutePost');
const RoutePut = require('./RoutePut');
const RouteDelete = require('./RouteDelete');

class Generator {

    static routeGET(model) {
      let uri = `/api/v1/${model.pluralName}`;
      let modelName = model.name;
      let idParam = false;
      let title = Route.createTitle('GET', modelName, idParam);
      let version = 1;
      let description = Route.createDescription('GET', modelName, idParam);
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
      return new RouteGet(uri, modelName, idParam, title, version, description, headers, inputs, outputs);
    }

    static routeGETID(model) {
      let uri = `/api/v1/${model.pluralName}/:id`;
      let modelName = model.name;
      let idParam = true;
      let title = Route.createTitle('GET', modelName, idParam);
      let version = 1;
      let description = Route.createDescription('GET', modelName, idParam);
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
      return new RouteGet(uri, modelName, idParam, title, version, description, headers, inputs, outputs);
    }

    static routePOST(model) {
      let uri = `/api/v1/${model.pluralName}`;
      let modelName = model.name;
      let idParam = false;
      let title = Route.createTitle('POST', modelName, idParam);
      let version = 1;
      let description = Route.createDescription('POST', modelName, idParam);
      let headers = [];
      let inputs = [];
      for (let i in model.fields) {
        inputs.push(model.fields[i].name);
      }
      let outputs = [];
      return new RoutePost(uri, modelName, title, version, description, headers, inputs, outputs);
    }

    static routePUT(model) {
      let uri = `/api/v1/${model.pluralName}/:id`;
      let modelName = model.name;
      let idParam = true;
      let title = Route.createTitle('PUT', modelName, idParam);
      let version = 1;
      let description = Route.createDescription('PUT', modelName, idParam);
      let headers = [];
      let inputs = [];
      for (let i in model.fields) {
        inputs.push(model.fields[i].name);
      }
      let outputs = [];
      return new RoutePut(uri, modelName, title, version, description, headers, inputs, outputs);
    }

    static routeDELETE(model) {
      let uri = `/api/v1/${model.pluralName}/:id`;
      let modelName = model.name;
      let idParam = true;
      let title = Route.createTitle('DELETE', modelName, idParam);
      let version = 1;
      let description = Route.createDescription('DELETE', modelName, idParam);
      let headers = [];
      let inputs = [];
      let outputs = [];
      return new RouteDelete(uri, modelName, title, version, description, headers, inputs, outputs);
    }
}

module.exports = Generator;
