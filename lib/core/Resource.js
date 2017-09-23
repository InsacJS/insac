'use strict'
/** @ignore */ const Route = require('./Route')

/**
* Clase que se encarga de describir y controlar todos los recursos.
*/
class Resource {

  /**
  * @param {!String} path Dirección URI asignada al recurso.
  * @param {!Object} properties Propiedades del recurso.
  * @param {String} [properties.version=1] Versión del recurso.
  * @param {!Model} properties.model Modelo asociado al recurso.
  * @param {String} [properties.description] Descripción del recurso.
  * @param {Object[]} [properties.middlewares] Lista de middlewares.
  * @param {Object} [properties.output] Objeto que contiene todos los campos que puede devolver en el resultado.
  * @param {Route[]} [properties.routes] Colección de rutas.
  */
  constructor(path, properties) {

    /**
    * Nombre del recurso.
    * @type {String}
    */
    this.name = properties.model.name

    /**
    * URI del recurso.
    * @type {String}
    */
    this.path = path

    /**
    * Modelo asociado a esta ruta.
    * @type {Model}
    */
    this.model = properties.model

    /**
    * Rol asignado a este recurso.
    * @type {String}
    */
    this.rol = properties.rol

    /**
    * descripción del recurso.
    * @type {String}
    */
    this.description = properties.description

    /**
    * Versión de la ruta.
    * @type {Number}
    */
    this.version = properties.version || 1

    /**
    * Datos de salida.
    * @type {Object}
    */
    this.output = {}
    if (properties.output) {
      this.output = properties.output
    }

    /**
    * Colección de middlewares asociados a esta ruta.
    * @type {Object[]} middlewares
    * @type {String} middlewares.name Nombre del middleware.
    * @type {Object} middlewares.args Argumentos que se pasarán al middleware.
    * @type {Function} middlewares.callback Función callback del middleware.
    */
    this.middlewares = properties.middlewares || []

    /**
    * Colección de rutas
    * @type {Route[]}
    */
    this.routes = properties.routes || []
  }

  /**
  * Devuelve un identificador único del recurso, se toma en cuenta el rol (si es que tuviese),
  * la versión y el nombre.
  * @return {String}
  */
  ID() {
    let rol = this.rol || 'public'
    return `[${rol}] v${this.version} ${this.name}`
  }

  /**
  * Adiciona un recurso a la colección de recursos. La ruta ruta es relativa al reurso.
  * @param {String} method Método de la ruta.
  * @param {String} path Dirección de la ruta.
  * @param {Object} properties Propiedades de la ruta.
  */
  addRoute(method, path, properties) {
    let routePath = `${this.path}${path}`
    properties.version = this.version
    properties.rol = this.rol
    properties.model = this.model
    properties.middlewares = properties.middlewares || this.middlewares
    properties.output = properties.output || this.output
    let route = new Route(method, routePath, properties)
    this.routes.push(route)
  }

  /**
  * Verifica que todos los datos sean válidos y lo actualiza según sea necesario.
  * Actualiza los middlewares de las rutas.
  * @param {!Insac} app Instancia de la aplicación.
  */
  init(app) {
    for (let i in this.routes) {
      this.routes[i].init(app)
    }
  }

  /**
  * Devuelve la documentación de todas las rutas del recurso, en formato de tezto plano.
  * @return {String}
  */
  apidoc() {
    let apidocContent = ""
    for (let i in this.routes) {
      apidocContent += this.routes[i].apidoc() + "\n"
    }
    return apidocContent
  }

}

module.exports = Resource
