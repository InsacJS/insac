'use strict'
/** @ignore */ const cors = require('cors')
/** @ignore */ const bodyParser = require('body-parser')

/**
* Describe las caracteristicas y comportamiento de un middleware.
*/
class Middleware {

  /**
  * Crea una instancia de la clase Middleware.
  * @param {!String} name Nombre del middleware.
  * @param {!Object} properties Propiedades del middleware.
  */
  constructor(name, properties) {

    /**
    * Nombre del middleware
    * @type {String}
    */
    this.name = name

    /**
    * Datos de entrada
    * @type {Object}
    */
    this.input = {}
    if (properties.input) {
      this.input = {
        headers: properties.input.headers || {},
        params: properties.input.params || {},
        body: properties.input.body || {}
      }
    }

    /**
    * Controlador del middleware.
    * @type {Function}
    */
    this.controller = properties.controller
  }

  /**
  * Devuelve una función de tipo callback que puede ser incluido directamente
  * en el servidor express.
  * @return {Function}
  */
  getCallback() {
    return this.controller
  }

}

Middleware.CORS = cors({
  'origin': '*',
  'methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'preflightContinue': false,
  'allowedHeaders': 'Content-Type,Authorization,Content-Length,Content-Range'
})
Middleware.BODY_PARSER_JSON = bodyParser.json()
Middleware.BODY_PARSER_URL_ENCODED = bodyParser.urlencoded({ extended: false })

module.exports = Middleware
