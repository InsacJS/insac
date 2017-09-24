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

    /**
    * Configuración para generar el apidoc.
    * @type {Object}
    */
    this.apidoc = Config.default(this.projectPath).apidoc

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
        if (typeof this.path[prop] != 'undefined') this.path[prop] = path.resolve(this.projectPath, config.path[prop])
      }
    }
    if (config.server) {
      for (let prop in config.server) {
        if(typeof this.server[prop] != 'undefined') this.server[prop] = config.server[prop]
      }
    }
    if (config.database) {
      for (let prop in config.database) {
        if(typeof config.database[prop] != 'undefined') this.database[prop] = config.database[prop]
      }
    }
    if (config.auth) {
      if (config.auth.roles) this.auth.roles = config.auth.roles
      if (config.auth.token) {
        if (config.auth.token.key) this.auth.token.key = config.auth.token.key
        if (config.auth.token.expires) this.auth.token.expires = config.auth.token.expires
      }
    }
    if (config.apidoc) {
      if (config.apidoc.name) this.apidoc.name = config.apidoc.name
      if (config.apidoc.version) this.apidoc.version = config.apidoc.version
      if (config.apidoc.description) this.apidoc.description = config.apidoc.description
      if (config.apidoc.title) this.apidoc.title = config.apidoc.title
      if (config.apidoc.url) this.apidoc.url = config.apidoc.url
      if (config.apidoc.header) {
        if (config.apidoc.header.title) this.apidoc.header.title = config.apidoc.header.title
        if (config.apidoc.header.filename) this.apidoc.header.filename = path.resolve(this.projectPath, config.apidoc.header.filename)
      }
      if (config.apidoc.footer) {
        if (config.apidoc.footer.title) this.apidoc.footer.title = config.apidoc.footer.title
        if (config.apidoc.footer.filename) this.apidoc.footer.filename = path.resolve(this.projectPath, config.apidoc.footer.filename)
      }
      if (config.apidoc.template) {
        if (typeof config.apidoc.template.withGenerator != 'undefined') this.apidoc.template.withGenerator = config.apidoc.template.withGenerator
        if (typeof config.apidoc.template.withCompare != 'undefined') this.apidoc.template.withCompare = config.apidoc.template.withCompare
        if (typeof config.apidoc.template.forceLanguage != 'undefined') this.apidoc.template.forceLanguage = config.apidoc.template.forceLanguage
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
        },
        roles: [
          {id:1, nombre:'Administrador', alias:'admin'}
        ]
      },
      apidoc: {
        name: "Aplicación INSAC",
        version: "1.0",
        description: "Servicio web creado con el framework INSAC",
        title: "Apidoc · INSAC",
        url: "http://localhost:7000",
        header: {
          title: 'INICIO',
          filename: './header.md'
        },
        footer: {
          title: undefined,
          filename: undefined
        },
        template: {
          withGenerator: true,
          withCompare: false,
          forceLanguage: "es"
        }
      }
    }
  }
}

Config.DEFAULT_PROJECT_PATH = DEFAULT_PROJECT_PATH

module.exports = Config
