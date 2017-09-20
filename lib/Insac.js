'use strict'
/** @ignore */ const path = require('path')
/** @ignore */ const async = require('async')
/** @ignore */ const Config = require('./core/Config')
/** @ignore */ const Server = require('./core/Server')
/** @ignore */ const Database = require('./core/Database')
/** @ignore */ const Util = require('./utils/Util')
/** @ignore */ const Model = require('./core/Model')
/** @ignore */ const Middleware = require('./core/Middleware')
/** @ignore */ const Route = require('./core/Route')
/** @ignore */ const Resource = require('./core/Resource')
/** @ignore */ const Seed = require('./core/Seed')
/** @ignore */ const ApiCreator = require('./core/ApiCreator')
/** @ignore */ const { UnauthorizedError } = require('./core/Response').errors

/**
* Clase principal que se encarga describir los atributos y comportamiento
* de la aplicación.
*/
class Insac {

  /**
  * Crea una instancia de la clase Insac
  * @param {Config} [config] Objeto que contiene todas las configuraciones.
  */
  constructor(env = 'development', projectPath = Config.DEFAULT_PROJECT_PATH) {

    console.log("\n")
    console.log("|==========================================|")
    console.log("|===   I N S A C    F R A M E W O R K   ===|")
    console.log("|==========================================|")
    console.log("\n")

    /**
    * Datos de configuración del proyecto y de la aplicación.
    * @type {Config}
    */
    this.config = this._createConfig(env, projectPath)

    /**
    * Colección de modelos.
    * @type {Model[]}
    */
    this.models = []

    /**
    * Colección de middlewares (Solamente el contenido del archivo y no asi
    * la instancia que este devuelve).
    * @type {Function[]}
    */
    this.middlewares = []

    /**
    * Colección de rutas.
    * @type {Route[]}
    */
    this.routes = []

    /**
    * Colección de recursos.
    * @type {Resource[]}
    */
    this.resources = []

    /**
    * Colección de seeders.
    * @type {Seed[]}
    */
    this.seeders = []

    /**
    * Objeto que gestiona la base de datos.
    * @type {Database}
    */
    this.database = new Database(this.config)

    /**
    * Objeto que gestiona el servidor.
    * @type {Server}
    */
    this.server = new Server(this.config)
  }

  /**
  * Devuelve una instancia de la clase Config con toda la configuración del proyecto ( .insac.js ) y de la aplicación ( development.js )
  * @param {!String} env Ambiente de ejecución.
  * @param {!String} projectPath Ruta absoluta del directorio raiz del proyecto.
  * @return {Config}
  */
  _createConfig(env, projectPath) {
    let config, configPath = Config.default(projectPath).path.config
    // Primero se carga la configuración del proyecto, para obtener el directorio de configuraciones,
    // para asi poder cargar la configuración para el ambiente de ejecución adecuado.
    let fileName = `.insac`
    let projectConfig = Util.getContentFiles(projectPath, {fileName:fileName, recursive:false})
    if (Object.keys(projectConfig).length == 1) {
      projectConfig = projectConfig[fileName]
      // Si se cambia el directorio de configuración por defecto, las
      // configuraciones se cargarán a partir de este.
      if (projectConfig.path && projectConfig.path.config) {
        configPath = path.resolve(projectPath, projectConfig.path.config)
      }
    } else {
      // Si no se encuentra el archivo '.insac.js', no se actualizará ninguna configuración del proyecto.
      projectConfig = {}
    }
    // Se carga la configuración para el ambiente de desarrollo especificado.
    let envConfig = Util.getContentFiles(configPath, {fileName:env, recursive:false})
    if (Object.keys(envConfig).length == 1) {
      config = envConfig[env]()
    } else {
      config = new Config({env:env, projectPath:projectPath})
    }
    // Se actualizan las configuraciones del proyecto
    projectConfig.projectPath = projectPath || config.projectPath
    config.update(projectConfig)
    return config
  }

  /**
  * Adiciona un modelo a la colección de modelos de la aplicación y
  * actualiza todos los objeros involucrados, al mismo tiempo se crea
  * el modelo sequelize para realizar consultas a la base de datos.
  * @param {!Model} model Objeto que contiene toda la información del modelo.
  */
  addModel(model) {
    // 1. Si model == string, obtener la instancia model desde el archivo model.js.
    if (typeof model == 'string') {
      let result = Util.getContentFiles(this.config.path.models, {fileName:model})
      if (Object.keys(result).length == 0) {
        throw new Error(`No existe el modelo '${model}' dentro del directorio '${this.config.path.models}'`)
      }
      model = result[model](this, this.models)
    }
    // 2. Si model no es una instancia de la clase Model, lanzar un error.
    if (!(model instanceof Model)) {
      throw new Error(`El argumento 'model' debe ser una instancia de la clase Model`)
    }
    // 3. Se adiciona el modelo a la colección de modelos.
    this.models[model.name] = model
    // 4. Se actualizan los modelos involucrados (referencias y asociaciones).
    this.models[model.name].updateModels(this.models)
    // 5. Se crea el modelo sequelize.
    let define = this.models[model.name].sequelize()
    let sequelizeModel = this.database.sequelize.define(define.name, define.attributes, define.options)
    // 6. Se adiciona el modelo sequelize a la colección de modelos de la base de datos.
    this.database.addModel(sequelizeModel)
    // 7. Se actualizan las referencias de los modelos sequelize.
    this.database.updateModels(this.models[model.name])
  }

  /**
  * Adiciona un middleware a la colección de middlewares.
  * @param {!Middleware} middleware Instancia de un middleware.
  */
  addMiddleware(middleware) {
    let middlewareFunction = (insac, model, db, args) => {
      return middleware
    }
    this.middlewares[middleware.name] = middlewareFunction
    // Si es un middleware global (el nombre comienza con '/'), se adiciona
    // directamente al servidor express.
    if (middleware.name.startsWith('/')) {
      this.server.addMiddleware(middleware.name, middleware.getCallback())
    }
  }

  /**
  * Adiciona solamente el contenido de los archivos middlewares a la colección
  * de middlewares de la aplicación. Nota.- Se los instanciará cuando las rutas lo requieran,
  * de esta forma es posible pasarle los argumentos descritos en la ruta.
  */
  addMiddlewares() {
    let files = Util.getContentFiles(this.config.path.middlewares)
    for (let name in files) {
      this.middlewares[name] = files[name]
    }
  }

  /**
  * Adiciona una instancia de la clase Seed
  * @param {!Seed} seed
  */
  addSeed(seed) {
    this.seeders[seed.name] = seed
  }

  /**
  * Adiciona todos los seeders a la coleccion de seeders.
  */
  addSeeders() {
    let files = Util.getContentFiles(this.config.path.seeders)
    for (let name in files) {
      this.addSeed(files[name](this))
    }
  }

  /**
  * Adiciona una ruta a la colección de rutas de la aplicación y
  * actualiza sus campos si se requiere, al mismo tiempo se adiciona al
  * servidor express.
  * @param {!Route} route Objeto que contiene toda la información de la ruta.
  */
  addRoute(route) {
    route.init(this)
    this.routes.push(route)
    this.server.addRoute(route.method, route.path, route.getCallback(this.models, this.db()))
  }

  /**
  * Adiciona rutas a partir de los archivos que se encuentran dentro
  * del directorio de rutas.
  */
  addRoutes() {
    let contentFiles = Util.getContentFiles(this.config.path.routes)
    for (let i in contentFiles) {
      let contentFile = contentFiles[i]
      // Crea una instancia de la clase Route.
      let result = contentFile(this, this.models, this.db())
      this.addRoute(result)
    }
  }

  /**
  * Adiciona un recurso a la colección de rescursos de la aplicación y
  * actualiza sus campos si se requiere, al mismo tiempo se adiciona al
  * servidor express.
  * @param {!Resource} resource Objeto que contiene toda la información del recurso.
  */
  addResource(resource) {
    resource.init(this)
    this.resources[resource.name] = resource
    for (let i in resource.routes) {
      let route = resource.routes[i]
      this.server.addRoute(route.method, route.path, route.getCallback(this.models, this.db()))
    }
  }

  /**
  * Adiciona recursos a partir de los archivos que se encuentran dentro
  * del directorio de recursos.
  */
  addResources() {
    let contentFiles = Util.getContentFiles(this.config.path.resources)
    for (let i in contentFiles) {
      let contentFile = contentFiles[i]
      // Crea una instancia de la clase Resource.
      let result = contentFile(this, this.models, this.db())
      this.addResource(result)
    }
  }

  /**
  * Crea la documentación de la API.
  * @return {Promise}
  */
  createApidoc() {
    let apiCreator = new ApiCreator()
    return apiCreator.create(this)
  }

  /**
  * Crea las tablas en la base de datos, a partir de los modelos.
  * @return {Promise} Devuelve una promesa.
  */
  migrate() {
    return this.database.migrate(this.models)
  }

  /**
  * Inserta registros en la base de datos a partir de la colección de seeders.
  * @return {Promise} Devuelve una promesa.
  */
  seed() {
    return new Promise((resolve, reject) => {
      console.log(" Iniciando seeders ...\n")
      let tasks = []
      for (let i in this.seeders) {
        tasks.push(this.seeders[i].getCallback(this.models, this.db()))
      }
      async.waterfall(tasks, (err, result) => {
        if (err) {
          reject(err)
        } else {
          console.log("\n Seeders finalizado exitosamente\n")
          resolve()
        }
      })
    })
  }

  /**
  * Devuelve un objeto con todos los modelos sequelize, una instancia y una
  * referencia a la clase Sequelize
  * @return {Object}
  */
  db() {
    return this.database.db()
  }

  /**
  * Inicia el servidor express.
  * @param {Number} [port] Puerto sobre el que se ejecutará la aplicación.
  * El puerto por defecto es el que se describe en la configuración de la aplicación.
  */
  listen(port) {
    port = port || this.config.server.port
    this.server.listen(port)
    console.log(` La aplicación esta ejecutándose en modo '${this.config.env}' sobre el puerto ${port}`)
  }

  /**
  * Encripta un password (texto) con un hash md5.
  * @param {!String} password - Password a encriptar (texto legible).
  * @return {String} Password encriptado (texto encriptado).
  */
  encryptPassword(password) {
    return Util.encryptPassword(password)
  }

  /**
  * Crea un token utilizando los parámetros decritos en la configuración (config.auth.token).
  * @param {!Object} data - Objeto que se guardará dentro del token.
  * @return {String} Token encriptado.
  */
  createToken(data) {
    return Util.createToken(data, this.config.auth.token.key, this.config.auth.token.expires)
  }

  /**
  * Decodifica un token, utilizando los parámetros decritos en la configuración (config.auth.token).
  * @param {!String} tokenEncrypted - Token encriptado.
  * @return {Object} data - Objeto que se guardó dentro del token.
  */
  decodeToken(tokenEncrypted) {
    try {
      // Decodifica el token
      let tokenDecoded = Util.decodeToken(tokenEncrypted, this.config.auth.token.key)
      // Verifica si el token ha expirado
      if (tokenDecoded.exp <= Date.now()) {
        throw new UnauthorizedError(`El token ha expirado`)
      }
      // Devuelve los datos almacenados dentro del token
      return tokenDecoded.data
    } catch(err) { }
    // Si llega hasta este punto, significa que hubo algún tipo de error.
    throw new UnauthorizedError(`El token es inválido`)
  }

  /**
  * Devuelve el id de un rol, a partir de su nombre ó alias.
  * @param {!String} alias Alias ó nombre del rol.
  * @return {Number}
  */
  getRolId(alias) {
    for (let i in this.config.auth.roles) {
      let rol = this.config.auth.roles[i]
      if ((rol.alias == alias) || (rol.nombre == alias)) {
        return rol.id
      }
    }
  }
}

module.exports = Insac
