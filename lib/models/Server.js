'use strict'
/** @ignore */ const express = require('express')
/** @ignore */ const graphqlHTTP = require('express-graphql')
/** @ignore */ const Middleware = require('./Middleware')
/** @ignore */ const Config = require('./Config')
/** @ignore */ const ResponseManager = require('./ResponseManager')

/**
* Se encarga de controlar el servidor sobre el que se ejecuta la aplicación.
*/
class Server {

  /**
  * Crea una instancia de la clase Server.
  * @param {Object} [config] Opciones de configuración del servidor.
  * @param {Number} [config.port=7000] - Puerto sobre el que se ejecutará la aplicación.
  * @param {Boolean} [config.all200=false] - Indica si todos los códigos de respuesta del servidor seran 200 (status: OK). El código de error verdadero se incluirá en el body.
  */
  constructor(config = Config.defaultServer()) {
    /**
    * Instancia del servidor express
    * @type {ExpressServer}
    * @see http://expressjs.com/es/
    */
    this.express = express()

    let responseManager = new ResponseManager(config)
    responseManager.assignTo(this.express.response)

    // Carga los middlewares por defecto
    this._loadDefaultMiddlewares()
  }

  /**
  * Incorpora un middleware global al servidor.
  * @param {String} path Rutas a las que afectará el middleware.
  * @param {Function} callback Función de tipo callback.
  */
  addMiddleware(path, callback) {
    console.log(" [MIDDLEWARE] ", path)
    this.express.use(path, callback)
  }

  /**
  * Incorpora una ruta al servidor.
  * @param {String} method - Methodo HTTP.
  * @param {String} path - Ruta de acceso.
  * @param {Function} callback Función de tipo callback.
  */
  addRoute(method, path, callback) {
    this.express[method.toLowerCase()](path, callback)
    console.log(` [${method}] ${path}`)
  }

  /**
  * Inicia el servidor para que acepte peticiones del cliente. Devuelve una función de tipo Promise.
  * @param {Number} [port] Puerto sobre el que se ejecutarrá la aplicación.
  */
  listen(port) {
    // Adiciona un middleware, para
    this.express.use((req, res, next) => {
      res.error404()
    })
    this.express.listen(port)
  }

  /**
  * Incorpora los middlewares por defecto al servidor
  */
  _loadDefaultMiddlewares() {
    this.express.use(Middleware.CORS().controller)
    this.express.use(Middleware.BODY_PARSER_JSON().controller)
    this.express.use(Middleware.BODY_PARSER_URL_ENCODED().controller)
  }
}

module.exports = Server
