'use strict'
/** @ignore */ const fs = require('fs')
/** @ignore */ const path = require('path')

/**
* Administra todas las configuraciones del proyecto y de la aplicación.
*/
class Config {

  /**
  * Crea una instancia del objeto Config.
  * @param {Object} [config={}] - Objeto que contiene todas las variables de configuración.
  * @param {String} [config.env='development'] - Tipo de ambiente sobre el que se ejecutará la aplicación (development, test ó production).
  * @param {String} [config.projectPath] - Ruta absoluta del directorio raiz del proyecto.
  * @param {String} [config.path] - Rutas absolutas de los directorios del proyecto.
  * @param {String} [config.path.public] - Carpeta pública.
  * @param {String} [config.path.config] - Carpeta donde se encuentran los archivos de configuración.
  * @param {String} [config.path.global] - Carpeta donde se encuentran los archivos que contienen las variables globales de la aplicación.
  * @param {String} [config.path.middlewares] - Carpeta donde se encuentran los middlewares.
  * @param {String} [config.path.models] - Carpeta donde se encuentran los modelos.
  * @param {String} [config.path.routes] - Carpeta donde se administran todas las rutas.
  * @param {String} [config.path.seeders] - Carpeta donde se encuentran los seeders.
  * @param {Object} [config.server] - Objeto que contiene los campos de configuración del servidor. Todas las opciones posibles se describen en {@link Server#constructor}
  * @param {Object} [config.database] - Configuración del servidor de base de datos. Todas las opciones posibles se describen en {@link Database#constructor}
  * @param {Object} [config.auth] - Objeto que contiene los campos de configuración para el sistema de autenticación.
  * @param {Object} [config.auth.token] - Objeto que contiene información de configuración del token para el sistema de autenticación.
  * @param {String} [config.auth.token.key='SECRET'] - Clave secreta que se utiliza para crear el token.
  * @param {Number} [config.auth.token.expires=86400] - Tiempo en segundos que indica la validez del token desde su creación.
  */
  constructor(config = {}) {
    /**
    * Variable de entorno que almacena el tipo de ejecución.
    * @type {String} [env='development']
    */
    this.env = process.env.NODE_ENV = config.env || 'development'

    /**
    * Ruta del directorio raiz del proyecto.
    * @type {String}
    */
    this.projectPath = config.projectPath || Config.defaultProjectPath()

    /**
    * Rutas de los directorios del proyecto
    * @type {Object}
    */
    this.path = Config.defaultPath(this.projectPath)

    /**
    * Configuración por defecto del servidor
    * @type {Object}
    */
    this.server = Config.defaultServer()

    /**
    * Configuración por defecto de la base de datos
    * @type {Object}
    */
    this.database = Config.defaultDatabase()

    /**
    * Configuración por defecto del sistema de autenticación mediante tokens
    * @type {Object}
    */
    this.auth = Config.defaultAuth()

    // Carga todas las configuraciones personalizadas
    this._loadProjectConfig(config, this.projectPath)
    this._loadAppConfig(config, this.path.config)
    this._loadAppGlobal()
  }

  /**
  * Se actualiza la configuración solamente para el modo de ejecución establecido al momento de crear el objeto. Es posible agregar datos adicionales al archivo de configuración, diferentes a los predefinidos.
  * @param {!String} environment Nombre que identifica al ambiente de ejecución (development, test ó production).
  * @param {Object} [config] Objeto que contiene los campos de configuración. Todas las configuraciones posibles se describen en: {@link Config#constructor}.
  */
  set(environment, config = {}) {
    if (this.env == environment) {
      this._setEnviroment(config)
    }
  }

  /**
  * Carga la configuración del proyecto si es que existe (archivo '.insac.js')
  * @param {Object} config Datos de configuración enviados desde el constructor.
  * @param {String} projectPath Ruta del directorio raiz del proyecto.
  */
  _loadProjectConfig(config = {}, projectPath) {
    try {
      let customConfig = require(path.resolve(projectPath, '.insac.js'))
      // Primero se carga la configuración del archivo .insac.js
      this._setProject(customConfig, projectPath)
    } catch(err) { } finally {
      // Después se carga la configuración que se envía directamente desde el constructor
      this._setProject(config, projectPath)
    }
  }

  /** @ignore  */
  _setProject(config = {}, projectPath) {
    if (config.path) {
      if (config.path.public) this.path.public = path.resolve(projectPath, config.path.public)
      if (config.path.config) this.path.config = path.resolve(projectPath, config.path.config)
      if (config.path.global) this.path.global = path.resolve(projectPath, config.path.global)
      if (config.path.middlewares) this.path.middlewares = path.resolve(projectPath, config.path.middlewares)
      if (config.path.models) this.path.models = path.resolve(projectPath, config.path.models)
      if (config.path.routes) this.path.routes = path.resolve(projectPath, config.path.routes)
      if (config.path.seeders) this.path.seeders = path.resolve(projectPath, config.path.seeders)
    }
  }

  /**
  * Carga la configuración de la aplicación si es que existe (Archivo 'config.js')
  * @param {Object} config Datos de configuración enviados desde el constructor.
  * @param {String} configPath Ruta del directorio Config.
  */
  _loadAppConfig(config = {}, configPath) {
    try {
      // Primero carga la configuración del archivo config.js
      this._loadAppConfigFromPath(configPath)
    } catch(err) { } finally {
      // Después se carga la configuración que se envía directamente desde el constructor
      this._setEnviroment(config)
    }
  }

  /** @ignore */
  _loadAppConfigFromPath(path) {
    if (fs.statSync(path).isDirectory()) {
      fs.readdirSync(path).forEach(file => {
        let newPath = `${path}/${file}`
        this._loadAppConfigFromPath(newPath)
      })
    } else {
      try { require(path)(this) } catch(err) { }
    }
  }

  /**
  * Carga todas las variables globales de la aplicación.
  */
  _loadAppGlobal() {
    try {
      this._loadAppGlobalFromPath(this.path.global)
    } catch(err) { }
  }

  /** @ignore */
  _loadAppGlobalFromPath(path) {
    if (fs.statSync(path).isDirectory()) {
      fs.readdirSync(path).forEach(file => {
        let newPath = `${path}/${file}`
        this._loadAppGlobalFromPath(newPath)
      })
    } else {
      require(path)
    }
  }

  /** @ignore */
  _setEnviroment(config = {}) {
    for (let prop in config) {
      if ((prop == 'env') || (prop == 'projectPath') || (prop == 'server') || (prop == 'database') || (prop == 'auth')) {
        if (prop == 'server') {
          if (config.server.all200) this.server.all200 = config.server.all200
          if (config.server.port) this.server.port = config.server.port
        }
        if (prop == 'database') {
          if (config.database.name) this.database.name = config.database.name
          if (config.database.username) this.database.username = config.database.username
          if (config.database.password) this.database.password = config.database.password
          if (config.database.dialect) this.database.dialect = config.database.dialect
          if (config.database.host) this.database.host = config.database.host
          if (config.database.port) this.database.port = config.database.port
        }
        if (prop == 'auth') {
          if (config.auth.token) {
            if (config.auth.token.key) this.auth.token.key = config.auth.token.key
            if (config.auth.token.expires) this.auth.token.expires = config.auth.token.expires
          }
        }
        continue
      }
      /**
      * Información extra que puede adicionarse al archivo de configuración.
      * @type {Object} prop
      */
      this[prop] = config[prop]
    }
  }

  /**
  * Directorio por defecto del proyecto
  * @return {String}
  */
  static defaultProjectPath(projectPath) {
    return path.resolve(__dirname, './../../../../')
  }

  /**
  * Configuración por defecto de las carpetas del proyecto.
  * @param {String} projectPath - Directorio base (directorio raiz del proyecto).
  * @return {Object}
  */
  static defaultPath(projectPath) {
    return {
      public: path.resolve(projectPath, './public'),
      config: path.resolve(projectPath, './src/config'),
      global: path.resolve(projectPath, './src/global'),
      middlewares: path.resolve(projectPath, './src/middlewares'),
      models: path.resolve(projectPath, './src/models'),
      routes: path.resolve(projectPath, './src/routes'),
      seeders: path.resolve(projectPath, './src/seeders')
    }
  }

  /**
  * Configuración por defecto del servidor.
  * @return {Object}
  */
  static defaultServer() {
    return {
      port: 7000,
      all200: false
    }
  }

  /**
  * Configuración por defecto de la base de datos
  * @return {Object}
  */
  static defaultDatabase() {
    return {
      name: 'insac_app',
      username: 'postgres',
      password: 'postgres',
      dialect: 'postgres',
      host: 'localhost',
      port: 5432
    }
  }

  /**
  * Configuración por defecto del sistema de autenticación mediante tokens
  * @return {Object}
  */
  static defaultAuth() {
    return {
      token: {
        key: 'SECRET',
        expires: 86400
      }
    }
  }

}

module.exports = Config
