'use strict'

class Resource {

  constructor(modelName, version, routes) {
    this.modelName = modelName;
    this.version = version;
    this.routes = routes;
  }

}

module.exports = Resource;
