'use strict'
/** @ignore */ const fs = require('fs')
/** @ignore */ const async = require('async')
/** @ignore */ const Config = require('./models/Config')
/** @ignore */ const Field = require('./models/Field')
/** @ignore */ const Server = require('./models/Server')
/** @ignore */ const Database = require('./models/Database')
/** @ignore */ const Model = require('./models/Model')
/** @ignore */ const Reference = require('./models/Reference')
/** @ignore */ const Middleware = require('./models/Middleware')
/** @ignore */ const Seeder = require('./models/Seeder')
/** @ignore */ const RouteManager = require('./models/RouteManager')

/**
* Se encarga de controlar todo el flujo de la aplicación.
*/
class Insac {

  /**
  * Crea una instancia de la clase Insac.
  * @param {String} [environment='development'] Tipo de ejecución. Valores admitidos: 'development', 'test', 'production'
  * @param {String} [projectPath] - Ruta absoluta del proyecto. Por defecto es la ruta del directorio donde se encuentra el archivo 'package.json'.
  */
  constructor(environment = 'development', projectPath) {

    console.log("\n")
    console.log("|==========================================|")
    console.log("|===   I N S A C    F R A M E W O R K   ===|")
    console.log("|==========================================|")
    console.log("\n")

    /**
    * Instancia del objeto que administra la configuración del proyecto y de la aplicación.
    * @type {Config}
    */
    this.config = new Config({env:environment, projectPath:projectPath})

    /**
    * Lista de modelos.
    * @type {Model[]}
    */
    this.models = []

    /**
    * Lista de middlewares.
    * @type {Middleware[]}
    */
    this.middlewares = []

    /**
    * Lista de rutas.
    * @type {Route[]}
    */
    this.routeManager = new RouteManager()

    /**
    * Instancia del objeto que administra el servidor.
    * @type {Server}
    */
    this.server = new Server(this.config.server)

    /**
    * Instancia del objeto que administra la base de datos.
    * @type {Database}
    */
    this.database = new Database(this.config.database)
  }

  /**
  * Adiciona un modelo y actualiza las referencias con otros modelos. Si solo se especifica
  *  el nombre, se buscará el archivo que lo define y si no existe tal archivo se creará un
  *  modelo por defecto con este nombre. También es posible enviar una instancia de un modelo
  *  como único argumento
  * @param {!String} name - Nombre del modelo.
  * @param {Object} [model] - Datos del modelo.
  */
  addModel(name, model) {
    if (typeof model == 'undefined') {
      // Si el primer argumento es una instancia de un modelo, organizamos los parámetros y continuamos con la ejecución.
      if (name instanceof Model) {
        model = name
        name = model.name
      } else {
        try {
          // Si no se envía el modelo, buscamos el archivo que define al modelo a partir de su nombre.
          let result = {}
          this._pathModelFile(name, this.config.path.models, result)
          // Si el archivo existe, se carga el modelo desde el archivo.
          if(result.path) {
            let modelFile = require(result.path)
            modelFile(this, this.models)
            return
          }
        } catch(err) { console.log(err); return }
      }
    }
    // 0. Actualizamos los campos
    if (model && Array.isArray(model.fields)) {
      let fields = {}
      for (let i in model.fields) {
        let fieldName = model.fields[i]
        if (typeof fieldName == 'string') {
          if (fieldName.startsWith('id_')) {
            let modelRef = fieldName.substr(3)
            if (this.models[modelRef]) {
              fields[fieldName] = Reference.ONE_TO_ONE(this.models[modelRef])
              continue
            }
          }
          fields[fieldName] = new Field()
          continue
        }
        throw new Error(`Se esperaba que el campo descrito en 'model.fields' sea de tipo string`)
      }
      model.fields = fields
    }
    // 1. Se adiciona el modelo a la colección de modelos.
    this.models[name] = new Model(name, model)
    // 2. Se crea el modelo para realizar consultas con la base de datos.
    let define = this.models[name].sequelize()
    let seqModel = this.database.sequelize.define(define.name, define.attributes, define.options)
    this.database.addModel(seqModel)
    // 3. Por defecto se actualizan las referencias de este modelo.
    this._updateReferences(this.models[name])
  }

  /**
  * Actualiza todas las referencias de un modelo. Si no se especifica el nombre del modelo, se actualizaran las referencias de todos los modelos.
  * @param {Model} model Instancia de un modelo previamente adicionado a la colección de modelos.
  */
  _updateReferences(model) {
    let modelName = model.name
    for (let prop in model.fields) {
      let field = model.fields[prop]
      if (field instanceof Reference) {
        let nameA = field.reference.model, nameB = model.name
        switch (field.reference.type) {
          case '1:1':
            this.models[nameA].options.associations.push({model:nameB, as:model.options.singular})
            this.database.models[nameA].hasOne(this.database.models[nameB], {as:model.options.singular, foreignKey: prop})
            this.database.models[nameB].belongsTo(this.database.models[nameA], {as:this.models[nameA].options.singular, foreignKey: prop})
            break
          case '1:N':
            this.models[nameA].options.associations.push({model:nameB, as:model.options.plural})
            this.database.models[nameA].hasMany(this.database.models[nameB], {as:model.options.plural, foreignKey: prop})
            this.database.models[nameB].belongsTo(this.database.models[nameA], {as:this.models[nameA].options.singular, foreignKey: prop})
            break
          default:
            let msg = `No se reconoce el tipo de referencia '${field.reference.type}' del modelo '${modelName}'`
            throw new Error(msg)
        }
      }
    }
  }

  /**
  * Devuelve la ruta del archivo de un modelo a partir de su nombre, dentro de un determinado directorio, si no lo encuentra devuelve undefined.
  * @param {!String} modelName Nombre del modelo.
  * @param {!String} path Ruta absoluta del directorio de búsqueda.
  * @param {!String} result Objeto que almacenará la ruta del archivo si lo encuentra. Debe pasarse un objeto vacio, despues revisar su contenido.
  * @return {String|undefined}
  */
  _pathModelFile(modelName, path, result) {
    if (fs.statSync(path).isDirectory()) {
      fs.readdirSync(path).forEach(file => {
        let newPath = `${path}/${file}`
        this._pathModelFile(modelName, newPath, result)
      })
    } else {
      let a = path.lastIndexOf('/')
      let b = path.indexOf('.js')
      let c = path.substr(a + 1, b - a - 1)
      if (c == modelName) {
        result.path = path
      }
    }
  }

  /**
  * Adiciona un middleware. Puede cargar un middleware global (name = '/api/auth') o local (name = 'auth')
  * @param {String} name - Nombre del middleware.
  * @param {Function} callback - Funcipon de tipo callback
  */
  addMiddleware(name, callback) {
    if ((typeof name == 'string') && (typeof callback == 'function')) {
      if (name.startsWith('/')) {
        this.server.addMiddleware(name, callback)
      } else {
        this.middlewares[name] = new Middleware(name, callback)
      }
      return
    }
    let msg = `Los parámetros de entrada no son válidos name = '${name}' y callback = '${callback}'`
    if ((typeof name == 'string') && (typeof callback == 'string')) {
      if(!name.startsWith('/')) {
        throw new Error(msg)
      }
      let callbackResult = this._buscarMiddleware(callback)
      if (!callbackResult) {
        throw new Error(`No existe el middleware '${callback}'`)
      }
      if (name.startsWith('/')) {
        this.server.addMiddleware(name, callbackResult.controller)
      } else {
        throw new Warning('El middleware',name,'ha sido sobreescrito')
      }
      return
    }
    throw new Error(msg)
  }

  /** @ignore */
  _buscarMiddleware(name) {
    let fileName = `${this.config.path.middlewares}/${name}.js`
    try {
      let file = require(fileName)
      let db = this.database.models
      db.sequelize = this.database.sequelize
      db.Sequelize = this.database.Sequelize
      try {
        file(this, this.models, db)
      } catch(err) { return undefined }
      return this.middlewares[name]
    } catch (err) {
      if (err.message && err.message.startsWith('Cannot find module')) {
        throw new Error(`No existe el archivo '${fileName}'`)
      }
      console.log(err)
      throw new Error(err)
    }
  }

  /**
  * Adiciona una ruta.
  * @param {String} method - Methodo HTTP.
  * @param {String} path - Ruta de acceso.
  * @param {Object} options - Opciones de creación de la ruta.
  * @throws {Error} Ocurre cuando el método no es válido.
  */
  addRoute(method, path, options = {}) {
    this.routeManager.addRoute(method, path, options, this.models)
    let route = this.routeManager.getRoute(method, path, options.version)
    let db = this.database.models
    db.sequelize = this.database.sequelize
    db.Sequelize = this.database.Sequelize
    this.server.addRoute(route.method, route.path, route.getCallback(this.models, db))
  }

  /**
  * Adiciona todas las rutas que se encuentran dentro del directorio de rutas..
  */
  addRoutes() {
    this._addRoutesFromPath(this.config.path.routes)
  }

  /**
  * Carga todas las rutas que se encuentren dentro de un directorio especifico (path).
  * @param {String} path - Ruta absoluta del directorio donde se encuentran todas las rutas.
  */
  _addRoutesFromPath(path) {
    if (fs.statSync(path).isDirectory()) {
      fs.readdirSync(path).forEach(file => {
        let newPath = `${path}/${file}`
        this._addRoutesFromPath(newPath)
      })
    } else {
      let db = this.database.models
      db.sequelize = this.database.sequelize
      db.Sequelize = this.database.Sequelize
      let routeFile = require(path)
      routeFile(this, this.models, db)
    }
  }

  // Crea un recurso (rutas GET, POST, ...) a partir de un modelo
  addResource(modelName) {
    // TODO
  }

  /**
  * Crea las tablas en la base de datos, a partir de los modelos.
  * @return {Promise<String>} Devuelve una promesa.
  */
  migrate() {
    return new Promise((resolve, reject) => {
      this.database.migrate(this.models).then(result => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }

  /**
  * Crea datos por defecto.
  * @return {Promise<String>} Devuelve una promesa.
  */
  seed() {
    let db = this.database.models
    db.sequelize = this.database.sequelize
    db.Sequelize = this.database.Sequelize
    let seeder = new Seeder(this.models, db)
    return new Promise((resolve, reject) => {
      console.log(" Iniciando seeders ...\n")
      let tasks = []
      try {
        let path = this.config.path.seeders
        fs.readdirSync(path).forEach(file => {
          let seedFile = require(`${path}/${file}`)
          tasks.push(seedFile(seeder))
        })
      } catch (err) {
        return reject(err)
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
  * Inicia la aplicación.
  * @param {Number} port Puerto sobre el que se ejecutará la aplicación. Por defecto es el que se especificó en el archivo de configuración.
  */
  listen(port) {
    if (!port) port = this.config.server.port
    this.server.listen(port)
    console.log(` La aplicación esta ejecutándose en modo '${this.config.env}' sobre el puerto ${port}`)
  }

}

module.exports = Insac
