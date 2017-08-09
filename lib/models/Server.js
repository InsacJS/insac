'user strict'
const Config = require('../config/Config')
const express = require('express')

class Server {

  constructor() {
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
  }

}

module.exports = Server
