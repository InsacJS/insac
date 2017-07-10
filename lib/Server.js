var express = require('express');
var Database = require('./Database');

class Server {
  constructor(models) {
    // Atributos
    this.database;
    this.server;
    this.models;
    // Valores por defecto
    this.database = new Database(models);
    this.server = express();
    this.models = models;

    console.log("\n");
    console.log("=========================");
    console.log("<<<  INSAC FRAMEWORK  >>>");
    console.log("=========================");
    console.log("\n");
  }

  middlewares(middlewares) {
    for (let i in middlewares) {
      let midd = middlewares[i];
      this.server.use(midd.path, midd.callback);
    }
  }

  resources(resources) {
    console.log("Creando recursos:\n");
    for (let i in resources) {
      let routes = resources[i].getRoutes();
      for (let j in routes) {
        let route = routes[j];
        let uri = route.uri;
        let controller = route.getController(this.models, this.database);
        console.log(" - ", route.method, uri);
        switch(route.method) {
          case 'GET': this.server.get(uri, controller); break;
          case 'POST': this.server.post(uri, controller); break;
          case 'PUT': this.server.put(uri, controller); break;
          case 'PATCH': this.server.patch(uri, controller); break;
          case 'DELETE': this.server.delete(uri, controller); break;
        }
      }
    }
  }

  routes(routes) {
    for (let i in routes) {
      let route = routes[i];
      let uri = route.uri;
      let controller = route.getController(this.models, this.database);
      console.log(" - ", route.method, uri);
      switch(route.method) {
        case 'GET': this.server.get(uri, controller); break;
        case 'POST': this.server.post(uri, controller); break;
        case 'PUT': this.server.put(uri, controller); break;
        case 'PATCH': this.server.patch(uri, controller); break;
        case 'DELETE': this.server.delete(uri, controller); break;
      }
    }
  }

  listen(port) {
    this.server.listen(port, () => {
      console.log(`\nEl servicio se esta ejecutando en el puerto ${port}`);
    });
  }

}

module.exports = Server;
