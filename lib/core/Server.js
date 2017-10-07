'use strict'
/** @ignore */ const express = require('express')
/** @ignore */ const Middleware = require('./Middleware')
/** @ignore */ const Response = require('./Response')

/**
* Se encarga de controlar el servidor.
*/
class Server {

  /**
  * Crea una instancia de la clase Server.
  * @param {!Config} [config] Objeto que contiene la confguración del servidor.
  */
  constructor(config) {
    /**
    * Instancia del servidor express
    * @type {ExpressServer}
    * @see http://expressjs.com/es/
    */
    this.express = express()

    // Adiciona metodos personalizados en el objeto response del servidor.
    let response = new Response(config)
    response.assignTo(this.express.response)

    // Carga los middlewares por defecto
    this.express.use(Middleware.CORS)
    this.express.use(Middleware.BODY_PARSER_JSON)
    this.express.use(Middleware.BODY_PARSER_URL_ENCODED)
    this.express.use(express.static(config.path.public))
  }

  /**
  * Incorpora un middleware al servidor.
  * @param {String} path Rutas a las que afectará el middleware.
  * @param {Function} callback Función de tipo callback.
  */
  addMiddleware(path, callback) {
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
  }

  /**
  * Inicia el servidor para que acepte peticiones del cliente.
  * @param {!Number} [port] Puerto sobre el que se ejecutarrá la aplicación.
  */
  listen(port) {
    // Se addiciona el middleware que controla los recursos inexistentes.
    this.express.use((req, res) => {
      res.error404()
    })
    // Se adiciona un middleware que controla los errores.
    this.express.use((err, req, res) => {
      res.error(err)
    })
    // Inicia el servidor
    this.express.listen(port)
  }

}

module.exports = Server
