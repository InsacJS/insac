'use strict'
/** @ignore */ const path = require('path')
/** @ignore */ const Util = require('../utils/Util')

/** @ignore */
const DEFAULT_PROJECT_PATH = path.resolve(__dirname, './../../../../')

/**
* Clase que se encarga de describir y gestionar todas las configuraciones, tanto
* del proyecto (directorios) como de la aplicación (ambiente de ejecución).
*/
class Config {

  /**
  * Crea una instancia de la clase Config.
  * @param {Object} [config] Objecto que contiene todos los parámetros de configuración.
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
    this.projectPath = config.projectPath || Config.DEFAULT_PROJECT_PATH

    /**
    * Rutas de los directorios del proyecto.
    * @type {Object}
    */
    this.path = Config.default(this.projectPath).path

    /**
    * Configuración del servidor.
    * @type {Object}
    */
    this.server = Config.default(this.projectPath).server

    /**
    * Configuración de la base de datos.
    * @type {Object}
    */
    this.database = Config.default(this.projectPath).database

    /**
    * Configuración para el sistema de autenticación por tokens.
    * @type {Object}
    */
    this.auth = Config.default(this.projectPath).auth

    // Actualiza las configuraciones por defecto
    this.update(config)
  }

  /**
  * Actualiza las configuraciones por defecto.
  * @param {Object} [config={}] Objeto que contiene todas las configuraciones.
  */
  update(config = {}) {
    if (config.projectPath) {
      for (let prop in this.path) {
        this.path[prop] = this.path[prop].replace(this.projectPath, config.projectPath)
      }
      this.projectPath = config.projectPath
    }
    if (config.path) {
      for (let prop in config.path) {
        if (this.path[prop]) this.path[prop] = path.resolve(this.projectPath, config.path[prop])
      }
    }
    if (config.server) {
      for (let prop in config.server) {
        if(this.server[prop]) this.server[prop] = config.server[prop]
      }
    }
    if (config.database) {
      for (let prop in config.database) {
        if(config.database[prop]) this.database[prop] = config.database[prop]
      }
    }
    if (config.auth) {
      if (config.auth.token) {
        if (config.auth.token.key) this.auth.token.key = config.auth.token.key
        if (config.auth.token.expires) this.auth.token.expires = config.auth.token.expires
      }
    }
  }

  /**
  * Configuración por defecto
  * @param {String} projectPath Ruta absoluta del directorio raiz del proyecto.
  */
  static default(projectPath) {
    return {
      env: 'development',
      projectPath: projectPath,
      path: {
        public: path.resolve(projectPath, './public'),
        config: path.resolve(projectPath, './src/config'),
        global: path.resolve(projectPath, './src/global'),
        middlewares: path.resolve(projectPath, './src/middlewares'),
        models: path.resolve(projectPath, './src/models'),
        routes: path.resolve(projectPath, './src/routes'),
        resources: path.resolve(projectPath, './src/resources'),
        seeders: path.resolve(projectPath, './src/seeders')
      },
      server: {
        port: 7000,
        all200: false
      },
      database: {
        name: 'insac_app',
        username: 'postgres',
        password: 'postgres',
        dialect: 'postgres',
        host: 'localhost',
        port: 5432
      },
      auth: {
        token: {
          key: 'SECRET',
          expires: 86400
        }
      }
    }
  }
}

Config.DEFAULT_PROJECT_PATH = DEFAULT_PROJECT_PATH

module.exports = Config
