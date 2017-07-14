'user strict'
var express = require('express');
var ServerConfig = require('./ServerConfig');

class Server {

  constructor() {
    this.server = express();
    this.config = null;

    console.log("\n");
    console.log("=========================");
    console.log("<<<  INSAC FRAMEWORK  >>>");
    console.log("=========================");
    console.log("\n");
  }

  setConfig(config) {
    this.config = config;
  }

  init(models, resources, middlewares, database) {
    for (let i in middlewares) {
      this.server.use(middlewares[i].path, middlewares[i].callback);
    }
    for (let i in resources) {
      for (let j in resources[i].routes) {
        let route = resources[i].routes[j];
        console.log(route.method,route.uri);
        switch (route.method) {
          case 'GET': this.server.get(route.uri, route.getController(models, database)); break;
          case 'POST': this.server.post(route.uri, route.getController(models, database)); break;
          case 'PUT': this.server.put(route.uri, route.getController(models, database)); break;
          case 'DELETE': this.server.delete(route.uri, route.getController(models, database)); break;
        }
      }
    }
    this.server.listen(this.config.port, () => {
      console.log(`\nEl servicio se esta ejecutando en el puerto ${this.config.port}`);
    });
  }

}

module.exports = Server;
