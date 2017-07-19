'user strict'
var Config = require('../Config');
var express = require('express');
var ServerConfig = require('./ServerConfig');

class Server {

  constructor() {
    this.server = express();

    console.log("\n");
    console.log("=========================");
    console.log("<<<  INSAC FRAMEWORK  >>>");
    console.log("=========================");
    console.log("\n");
  }

  init(models, resources, middlewares, database) {
    for (let i in middlewares) {
      this.server.use(middlewares[i].path, middlewares[i].callback);
    }
    for (let i in resources) {
      let resource = resources[i];
      /*if (resource.haveRouteSearch) {
        let routeSearch = resource.routeSearch;
        this.server.get(routeSearch.uri, routeSearch.getController());
      }*/
      for (let j in resource.routes) {
        let route = resource.routes[j];
        console.log(route.method,route.uri);
        switch (route.method) {
          case 'GET': this.server.get(route.uri, route.getController(models, database)); break;
          case 'POST': this.server.post(route.uri, route.getController(models, database)); break;
          case 'PUT': this.server.put(route.uri, route.getController(models, database)); break;
          case 'DELETE': this.server.delete(route.uri, route.getController(models, database)); break;
        }
      }
    }
    this.server.listen(Config.server.port, () => {
      console.log(`\nEl servicio se esta ejecutando en el puerto ${Config.server.port}`);
    });
  }

}

module.exports = Server;
