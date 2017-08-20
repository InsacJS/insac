'use strict'
// Importación de modulos externos
const fs = require('fs')
const path = require('path')
const jwt = require('jwt-simple')
const crypto = require('crypto')
const async = require('async')
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
    this.updateConfig(config)
    this.server = new Server()
    this.database = new Database()
  }

  // Actualiza la configuración global de la aplicacion
  updateConfig(config) {
    if (typeof config.general == 'object') {
      if (typeof config.general.locale != 'undefined') Config.general.locale = config.general.locale
      if (typeof config.general.modelsPath != 'undefined') Config.general.modelsPath = config.general.modelsPath
      if (typeof config.general.routesPath != 'undefined') Config.general.routesPath = config.general.routesPath
      if (typeof config.general.middlewaresPath != 'undefined') Config.general.middlewaresPath = config.general.middlewaresPath
      if (typeof config.general.seedersPath != 'undefined') Config.general.seedersPath = config.general.seedersPath
    }
    if (typeof config.response == 'object') {
      if (typeof config.response.all200 != 'undefined') Config.response.all200 = config.response.all200
    }
    if (typeof config.server == 'object') {
      if (typeof config.server.publicPath != 'undefined') Config.server.publicPath = config.server.publicPath
      if (typeof config.server.port != 'undefined') Config.server.port = config.server.port
      if (typeof config.server.url != 'undefined') Config.server.url = config.server.url
    }
    if (typeof config.database == 'object') {
      if (typeof config.database.dbname != 'undefined') Config.database.dbname = config.database.dbname
      if (typeof config.database.username != 'undefined') Config.database.username = config.database.username
      if (typeof config.database.password != 'undefined') Config.database.password = config.database.password
      if (typeof config.database.dialect != 'undefined') Config.database.dialect = config.database.dialect
      if (typeof config.database.timezone != 'undefined') Config.database.timezone = config.database.timezone
      if (typeof config.database.host != 'undefined') Config.database.host = config.database.host
      if (typeof config.database.port != 'undefined') Config.database.port = config.database.port
    }
    if (typeof config.auth == 'object') {
      if (typeof config.auth.jwtSecret != 'undefined') Config.auth.jwtSecret = config.auth.jwtSecret
    }
  }

  // Crea un nuevo modelo
  createModel(modelName, options) {
    return new Model(modelName, options)
  }

  // Adiciona un modelo a la aplicación, desde un archivo
  addModel(modelName) {
    let modelFile = require(`${Config.general.modelsPath}/${modelName}`)
    let model = modelFile(this, Field, DataType, Validator, Reference)
    model.seq = this.database.createSeqModel(model)
    this.models[modelName] = model
    this.database.referenceModel(this.models[modelName], this.models)
  }

  // Crea un nuevo middleware
  createMiddleware(path, controller) {
    return new Middleware(path, controller)
  }

  // Adiciona los middlewares
  addMiddleware(middlewareName) {
    this.addMiddleware(middlewareName)
  }

  addMiddleware(middlewareName) {
    let middlewareFile, middleware
    try {
      middlewareFile = require(`${Config.general.middlewaresPath}/${middlewareName}`)
      middleware = middlewareFile(this)
    } catch (err) {
      switch (middlewareName) {
        case 'cors':
          middleware = Middleware.CORS
          break
        case 'body-parser-json':
          middleware = Middleware.BODY_PARSER_JSON
          break
        case 'body-parser-url-encoded':
          middleware = Middleware.BODY_PARSER_URL_ENCODED
          break
        case 'error-handler':
          middleware = Middleware.ERROR_HANDLER
          break
        default:
          let msg = `No existe el middleware '${middlewareName}'`
          throw new Error(msg)
      }
    }
    this.middlewares[middlewareName] = middleware
    if (middleware.isGlobal()) {
      this.server.addMiddleware(middleware)
    }
  }

  // Crea una nueva ruta
  createRoute(method, path, options) {
    if (options.middlewares) {
      for (let j in options.middlewares) {
        let mw = options.middlewares[j]
        if (typeof mw == 'string') {
          options.middlewares[j] = this.middlewares[mw]
          if (typeof options.middlewares[j] == 'undefined') {
            let msg = `No existe el middleware '${mw}'`
            throw new Error(msg)
          }
        }
      }
    }
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
        this.server.addRoute(this, routes[i])
      }
    }
  }

  // Crea todas las tablas de la base de datos, a partir de los modelos
  migrate() {
    return this.database.migrate(this.models)
  }

  seed() {
    return new Promise((resolve, reject) => {
      console.log(" Iniciando seeders ...\n")
      let tasks = []
      try {
        let path = Config.general.seedersPath
        fs.readdirSync(path).forEach(file => {
          let seedFile = require(`${path}/${file}`)
          tasks.push(seedFile(this))
        })
      } catch (err) {
        return reject(err)
      }
      async.waterfall(tasks, (err, result) => {
        if (err) {
          reject(err)
        } else {
          console.log("\n Seeders finalizado exitosamente")
          resolve('OK')
        }
      })
    })
  }

  createSeed(modelName, dataArray) {
    return (callback) => {
      console.log(" - Creando seed", modelName)
      let tasks = []
      for (let i in dataArray) {
        let data = dataArray[i]
        let container = {}
        container[modelName] = {}
        let nivel = 1
        let task = this.createSubmodelTask(this.models[modelName], data, container, modelName, nivel)
        tasks.push(task)
      }
      async.waterfall(tasks, (err, result) => {
        if (err) {
          return callback(err)
        } else {
          callback(null)
        }
      })
    }
  }

  createSubmodelTask(model, data, container, fieldName, nivel) {
    let modelName = model.name
    let modelData = {}

    let asyncFunctions = []
    for (let i in model.fields) {
      let field = model.fields[i]
      if (field.isReference() && !data[field.name]) {
        let modelReference = field.reference.model
        container[fieldName][modelReference] = {}
        asyncFunctions.push(this.createSubmodelTask(this.models[modelReference], data[modelReference], container[fieldName], modelReference, nivel + 1))
      } else {
        //if ((nivel > 1) && (field.name == 'id')) {
        if (field.name == 'id' && !data['id']) {
          continue
        }
        modelData[field.name] = data[field.name]
      }
    }
    if (asyncFunctions.length > 0) {
      return (callback) => {
        async.waterfall(asyncFunctions, (err, result) => {
          if (err) {
            callback(err)
          } else {
            modelData = {}
            for (let i in model.fields) {
              let field = model.fields[i]
              if (field.isReference() && !data[field.name]) {
                modelData[field.name] = container[fieldName][field.reference.model].id
              } else {
                if (field.name == 'id' && !data['id']) {
                  continue
                }
                modelData[field.name] = data[field.name]
              }
            }
            this.models[modelName].seq.create(modelData).then(result => {
              container[fieldName].id = result.id
              callback(null)
            }).catch(err => {
              callback(err)
            })
          }
        })
      }

    } else {
      return (callback) => {
        this.models[modelName].seq.create(modelData).then(result => {
          container[fieldName].id = result.id
          callback(null)
        }).catch(err => {
          callback(err)
        })
      }
    }

  }

  // Inicia la aplicación
  init() {
    this.server.init()
  }

  createToken(data, exp = 86400000) {
    // Convierte un número en base 36, luego obtiene los 10 primeros caracteres
    // despues del punto decimal
    let tokenId = Math.random().toString(36).substr(2, 10) + ""
    let issuedAt = Date.now()            // tiempo actual en milisegundos
    let expire = issuedAt + exp     // 1 dia = 86400 segundos = 86400000 milisegundos
    let token = {
      iat: issuedAt,         // Issued at: Tiempo en que se generó el token
      jti: tokenId,          // Json Token Id: Identificador único para el token
      exp: expire,           // Tiempo en que el token expirará
      data: data
    }
    let tokenEncrypted = jwt.encode(token, Config.auth.jwtSecret);
    return tokenEncrypted
  }

  decodeToken(tokenEncrypted) {
    let tokenDecoded;
    try {
      tokenDecoded = jwt.decode(tokenEncrypted, Config.auth.jwtSecret);
    } catch (err) {}
    return tokenDecoded
  }

  encryptPassword(str) {
    return crypto.createHash("md5").update(str + "").digest("hex")
  }

}

// Crea una nueva aplicación
function createServer(config) {
  return new Insac(config)
}

Insac.createServer = createServer
Insac.Field = Field
Insac.DataType = DataType
Insac.Validator = Validator
Insac.Reference = Reference
Insac.Util = Util

module.exports = Insac
