'user strict'
const Config = require('../config/Config')
const Response = require('./Response')
const express = require('express')

class Server {

  constructor() {
    this.server = express()
    console.log("\n")
    console.log("|==========================================|")
    console.log("|===   I N S A C    F R A M E W O R K   ===|")
    console.log("|==========================================|")
    console.log("\n")
    Response.assignTo(this.server.response)
  }

  addMiddleware(middleware) {
    this.server.use(middleware.path, middleware.controller)
  }

  addRoute(insac, route) {
    let opt = {}
    let optMiddleware = route.createOptMiddleware(insac)
    let one = (req, res, next) => {
      optMiddleware(req, res, opt, next)
    }
    let two = []
    for (let i in route.middlewares) {
      let routeMiddleware = route.middlewares[i].controller
      two.push((req, res, next) => {
        routeMiddleware(req, res, opt, next)
      })
    }
    let controller = route.controller
    let three = (req, res, next) => {
      controller(req, res, opt, next)
    }
    console.log(" - ", route.method, route.path)
    switch (route.method) {
      case 'GET':
        this.server.get(route.path, one, two, three)
        break
      case 'POST':
        this.server.post(route.path, one, two, three)
        break
      case 'PUT':
        this.server.put(route.path, one, two, three)
        break
      case 'DELETE':
        this.server.delete(route.path, one, two, three)
        break
    }
  }

  init() {
    this.server.listen(Config.server.port, () => {
      console.log(`\n · El servicio esta ejecutándose en el puerto ${Config.server.port}`)
    })
  }

}

module.exports = Server
