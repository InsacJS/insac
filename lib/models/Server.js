'user strict'
<<<<<<< HEAD
const Config = require('../config/Config')
const express = require('express')
=======
const Config = require('../Config');
const express = require('express');
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7

class Server {

  constructor() {
<<<<<<< HEAD
    this.server = express()
    console.log("\n")
    console.log("|==========================================|")
    console.log("|===   I N S A C    F R A M E W O R K   ===|")
    console.log("|==========================================|")
    console.log("\n")
  }

  init(models, routes, middlewares, database) {
    for (let i in middlewares) {
      this.server.use(middlewares[i].path, middlewares[i].controller)
    }
    for (let i in routes) {
      let route = routes[i]
      console.log(" - ", route.method, route.path)
      switch (route.method) {
        case 'GET':
          this.server.get(route.path, route.createController(models, database))
          break
        case 'POST':
          this.server.post(route.path, route.createController(models, database))
          break
        case 'PUT':
          this.server.put(route.path, route.createController(models, database))
          break
        case 'DELETE':
          this.server.delete(route.path, route.createController(models, database))
          break
      }
    }
    this.server.listen(Config.server.port, () => {
      console.log(`\n · La aplicación esta ejecutandose en el puerto ${Config.server.port}`)
    })
=======
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
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7
  }

}

<<<<<<< HEAD
module.exports = Server
=======
module.exports = Server;
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7
