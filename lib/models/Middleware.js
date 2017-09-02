'use strict'
/** @ignore */ const cors = require('cors');
/** @ignore */ const bodyParser = require('body-parser');

/**
* Describe las caracteristicas y comportamiento de un middleware.
*/
class Middleware {

  /**
  * Crea una instancia de la clase Middleware.
  * @param {!String} name - Nombre con el que se identificará al middleware.
  * @param {!Function} controller - Función de tipo callback.
  */
  constructor(name, controller) {
    /**
    * Nombre con el que se identificará al middleware.
    * @type {String}
    */
    this.name = name

    /**
    * Función de tipo callback
    * @type {String}
    */
    this.controller = controller
  }

  /**
  * Devuelve un middleware para controlar el Intercambio de Recursos de Origen Cruzado (CORS, por sus siglas en inglés).
  * @see https://www.npmjs.com/package/cors
  * @return {Middleware}
  */
  static CORS() {
    return new Middleware('cors', cors({
      "origin": "*",
      "methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "preflightContinue": false,
      "allowedHeaders": "Content-Type,Authorization,Content-Length,Content-Range"
    }))
  }

  /**
  * Devuelve un middleware que solo parsea el contenido de la variable body como JSON.
  * @see https://www.npmjs.com/package/body-parser
  * @return {Middleware}
  */
  static BODY_PARSER_JSON() {
    return new Middleware('body-parser-json', bodyParser.json())
  }

  /**
  * Devuelve un middleware que parsea la url, para utilizar la variable req.body.
  * @see https://www.npmjs.com/package/body-parser
  * @return {Middleware}
  */
  static BODY_PARSER_URL_ENCODED() {
    return new Middleware('body-parser-url-encoded', bodyParser.urlencoded({ extended: false }))
  }

}

module.exports = Middleware
