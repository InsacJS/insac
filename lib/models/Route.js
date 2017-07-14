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

}

module.exports = Route;
