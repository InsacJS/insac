'use strict'
/** @ignore */ const fs = require('fs')
/** @ignore */ const async = require('async')
/** @ignore */ const InputManager = require('./InputManager')
/** @ignore */ const ResponseManager = require('./ResponseManager')

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
    let responseManager = new ResponseManager()
    let inputManager = new InputManager()
    // Por defecto devuelve un objeto options de sequelize que sirve para devolver todos los campos posibles
    let options = this._createOptions(models, db)
    // Callback principal
    return (req, res, next) => {
      try {
        // Valida todos los campos de entrada
        inputManager.validate(req, this)
      } catch(err) { return res.error422(err.message) }
      // Adiciona las funciones success200, success201 y el objeto options dentro de la variable req
      // Optimiza los campos a devolver en base a los campos especificados en la query
      responseManager.createSuccessAndOptions(req, res, this, models, options)
      // Procesa el resultado devuelto por el controlador
      let result = this.controller(req)
      // Devuelve el resultado adecuado en base al objeto devuelto por el controlador
      if (this._isThen(result)) {
        // Es una promesa then
        result.then(finalResult => {
          if (this.method == 'POST') { return res.success201(finalResult) }
          return res.success200(finalResult)
        }).catch(err => {
          return res.error(err)
        })
      } else if (this._isCatch(result)) {
        // Es una promesa catch
        result.catch(err => { return error(err) })
      } else {
        // Es el resultado final
        return res.success200(result)
      }
    }
  }

  /**
  * Devuelve un objeto options con todos los atributos e includes necesarios para realizar una consulta sequelize.
  */
  _createOptions(models, db) {
    if (!this.model) { return }
    let output = Array.isArray(this.output) ? this.output[0] : this.output
    let subInclude = this.model.includeOptions(output, models, db)
    let attributes = this.model.attributesOptions(output)
    let options = { attributes: attributes }
    if (subInclude.length > 0) {
      options.include = subInclude
    }
    return options
  }

  _isThen(result) {
    return (typeof result == 'object') && (typeof result.then != 'undefined')
  }

  _isCatch(result) {
    return (typeof result == 'object') && (typeof result.catch != 'undefined')
  }

}

module.exports = Route
