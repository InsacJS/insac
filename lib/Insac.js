'use strict'
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
  }

}

Insac.Field = Field
Insac.DataType = DataType
Insac.Validator = Validator
Insac.Reference = Reference
Insac.Util = Util

module.exports = Insac
