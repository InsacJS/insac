'use strict'
/** @ignore */ const fs = require('fs')
/** @ignore */ const async = require('async')
/** @ignore */ const Generator = require('./Generator')
/** @ignore */ const InputManager = require('./InputManager')
/** @ignore */ const ResponseManager = require('./ResponseManager')
/** @ignore */ const ServerError = ResponseManager.ServerError

/**
* Describe las caracteristicas y comportamiento de una ruta.
*/
class Route {

  /**
  * Crea una instancia de la clase Route
  * @param {String} method Método HTML que manejará la ruta.
  * @param {String} path URI del recurso.
  * @param {Object} options Opciones de la ruta.
  * @param {String} options.model Módelo asociado a la ruta.
  * @param {Number} [options.version=1] Número de versión de la ruta..
  * @param {Object} [options.input={}] Descripción de los datos de entrada.
  * @param {Object} [options.input.headers] Datos provenientes del encabezado (header).
  * @param {Object} [options.input.params] Datos provenientes de la URI.
  * @param {Object} [options.input.body] Datos Datos provenientes del cuerpo (body).
  * @param {Object} [options.output={}] Descripción de los datos de salida.
  * @param {Function} [options.controller] Función de tipo callback que describe el comportamiento de la ruta.
  */
  constructor(method, path, options = {}) {
    /**
    * Método HTML.
    * @type {String}
    */
    this.method = method

    /**
    * URI del recurso.
    * @type {String}
    */
    this.path = path

    /**
    * Modelo asociado a esta ruta.
    * @type {Model}
    */
    this.model = options.model

    /**
    * Versión de la ruta
    * @type {Number}
    */
    this.version = options.version || 1

    /**
    * Datos de entrada
    * @type {Object}
    */
    this.input = {}
    if (options.input) {
      this.input = {
        headers: options.input.headers || {},
        params: options.input.params || {},
        body: options.input.body || {}
      }
    }

    /**
    * Datos de salida
    * @type {Object}
    */
    this.output = {}
    if (options.output) {
      this.output = options.output
    }

    /**
    * Controlador de la ruta.
    * @type {Function}
    */
    this.controller = options.controller
  }

  /**
  * Devuelve una función de tipo callback que describe todo el comportamiento de la ruta.
  * @param {Model[]} models Modelos de la aplicación.
  * @param {Object} db Objeto que contiene todos los modelos sequelize, una instancia y una referencia de la clase Sequelize.
  * @abstract
  */
  getCallback(models, db) {
    let output = this.output
    let generator = new Generator(models, db)
    let options = generator.queryOptions(this)
    let responseManager = new ResponseManager()
    let inputManager = new InputManager()
    return (req, res, next) => {
      try {
        inputManager.validate(req, this)
      } catch(err) {
        return res.error422(err.message)
      }
      req.options = options
      responseManager.createSuccess(req, res, this, models)
      this.controller(req, res, next)
    }
  }

}

module.exports = Route
