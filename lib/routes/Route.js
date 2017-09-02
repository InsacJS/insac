'use strict'
/** @ignore */ const fs = require('fs')

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
  * @param {Object} [options.req={}] Descripción de los datos de entrada.
  * @param {Object} [options.req.headers] Datos provenientes del encabezado (header).
  * @param {Object} [options.req.params] Datos provenientes de la URI.
  * @param {Object} [options.req.body] Datos Datos provenientes del cuerpo (body).
  * @param {Object} [options.res={}] Descripción de los datos de salida.
  * @param {Object} [options.res.data] Formato de os datos de salida.
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
    this.req = {}
    if (options.req) {
      this.req = {
        headers: options.req.headers || {},
        params: options.req.params || {},
        body: options.req.body || {}
      }
    }

    /**
    * Datos de salida
    * @type {Object}
    */
    this.res = {
      data: {}
    }
    if (options.res) {
      this.res = {
        data: options.res.data
      }
    }
    if (!options.res && method == 'POST') {
      this.res = {
        data: this.model.fields
      }
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
  getCallback(models, db) {  }

}

module.exports = Route
