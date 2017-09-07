'use strict'
const _ = require('lodash')
const Route = require('./Route')
const Field = require('./Field')
const Model = require('./Model')

class RouteManager {

  constructor() {
    this.routes = []
  }

  addRoute(method, path, options, models) {
    this.updateOptions(method, path, options, models)
    let route = new Route(method, path, options)
    let routeID = `[${route.method}][v${route.version}] ${route.path}`
    this.routes[routeID] =route
  }

  getRoute(method, path, version = 1) {
    let routeID = `[${method}][v${version}] ${path}`
    return this.routes[routeID]
  }

  count() {
    return Object.keys(this.routes).length
  }

  updateOptions(method, path, options, models) {
    if (options.model) {
      if (typeof options.model == 'string') {
        if (!models[options.model]) {
          throw new Error(`No existe el modelo '${options.model}'`)
        }
        options.model = models[model]
      }
      if (!(options.model instanceof Model)) {
        throw new Error(`El campo 'options.model' debe ser una instancia de la clase Model`)
      }
    }
    if (options.input) {
      if (options.input.headers) {
        this._updateOptions(options.input.headers, options.model, "input.headers.", models)
      }
      if (options.input.params) {
        this._updateOptions(options.input.params, options.model, "input.params.", models)
      }
      if (options.input.body) {
        this._updateOptions(options.input.body, options.model, "input.body.", models)
      }
    }
    if (options.output) {
      this._updateOptions(options.output, options.model, "output.", models)
    }
  }

  _updateOptions(options, model, trace, models) {
    if (Array.isArray(options)) {
      return this._updateOptions(options[0], model, trace, models)
    }
    for (let prop in options) {
      let field = options[prop]
      if (field instanceof Field) {
        continue
      }
      // Actualiza el valor de los campos que tengan el valor Field.THIS
      if (typeof field == 'function') {
        if (typeof model == 'undefined') {
          throw new Error(`El campo '${trace}${prop}' requiere el atributo 'options.model'`)
        }
        if(!model.fields[prop]) {
          throw new Error(`El campo '${trace}${prop}' no es parte del modelo '${model.name}'`)
        }
        options[prop] = field(model.fields[prop])
        continue
      }
      // Busca el campo en las referencias y asociaciones del modelo
      if (typeof field == 'object') {
        let result = model.getModelOfProperty(prop, models)
        if (!result.model) {
          throw new Error(`El objeto '${trace}${prop}' no es una referencia o asociación del modelo '${model.name}'`)
        }
        if (result.isArray && !Array.isArray(options[prop])) {
          throw new Error(`El campo '${trace}${prop}' debe ser de tipo Array [{}]`)
        }
        if (!result.isArray && Array.isArray(options[prop])) {
          throw new Error(`El campo '${trace}${prop}' debe ser de tipo object {}`)
        }
        let fieldPath = `${trace}${prop}.`
        this._updateOptions(options[prop], result.model, fieldPath, models)
        continue
      }
      throw new Error(`El valor del campo '${trace}${prop}' es inválido`)
    }
  }

}

module.exports = RouteManager
