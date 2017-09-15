'use strict'
/** @ignore */ const Field = require('../fields/Field')
/** @ignore */ const OutputManager = require('./OutputManager')

/**
* Describe las caracteristicas y comportamiento de una ruta.
*/
class Route {

  /**
  * Crea una instancia de la clase Route.
  * @param {!String} method Método HTML que manejará la ruta.
  * @param {!String} path URI del recurso.
  * @param {!Object} properties Propiedades de la ruta.
  */
  constructor(method, path, properties) {

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
    this.model = properties.model

    /**
    * Versión de la ruta.
    * @type {Number}
    */
    this.version = properties.version || 1

    /**
    * Datos de entrada.
    * @type {Object}
    */
    this.input = { headers: {}, params: {}, body: {} }
    if (properties.input) {
      this.input = {
        headers: properties.input.headers || {},
        params: properties.input.params || {},
        body: properties.input.body || {}
      }
    }

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
    * Controlador de la ruta.
    * @type {Function}
    */
    this.controller = properties.controller
  }

  /**
  * Devuelve un identificador único de la ruta, se toma en cuenta el método, la versión y la uri.
  * @return {String}
  */
  ID() {
    return `${this.method} v${this.version} ${this.path}`
  }

  /**
  * Verifica que todos los datos sean válidos y lo actualiza según sea necesario.
  * Actualiza los middlewares.
  * @param {!Insac} app Instancia de la aplicación.
  */
  init(app) {
    // TODO
    if (this.model) {
      this._updateValueOfTHIS(this.input.headers, this.model, "input.headers.", app.models)
      this._updateValueOfTHIS(this.input.params, this.model, "input.params.", app.models)
      this._updateValueOfTHIS(this.input.body, this.model, "input.body.", app.models)
      this._updateValueOfTHIS(this.output, this.model, "output.", app.models)
    }
    for (let i in this.middlewares) {
      let middlewareRoute = this.middlewares[i]
      let args = middlewareRoute.args, middlewareName = middlewareRoute.name
      if (typeof app.middlewares[middlewareName] == 'undefined') {
        throw new Error(`No existe el middleware '${middlewareName}'`)
      }
      let middleware = app.middlewares[middlewareName](app, app.models, app.db(), args)
      let routePath = this.ID()
      this._copyMiddlewarePropertiesOnRoute(middleware.input.headers, this.input.headers, 'input.headers.', routePath, middlewareName)
      this._copyMiddlewarePropertiesOnRoute(middleware.input.params, this.input.params, 'input.params.', routePath, middlewareName)
      this._copyMiddlewarePropertiesOnRoute(middleware.input.body, this.input.body, 'input.body.', routePath, middlewareName)
      this.middlewares[i].callback = middleware.getCallback()
    }
  }

  /**
  * Copia las propiedades del middleware sobre la ruta.
  * @param {Object} origin Objeto que representa una propiedad del middleware.
  * @param {Object} destiny Objeto que representa una propiedad de la ruta.
  * @param {String} trace Cadena de texto que va almacenando la ruta de la propiedad.
  * @param {String} routePath Nombre que identifica a la ruta.
  * @param {String} middlewareName Nombre del middleware.
  */
  _copyMiddlewarePropertiesOnRoute(origin, destiny, trace, routePath, middlewareName) {
    for (let prop in origin) {
      if (destiny[prop]) {
        let message = `Advertencia.- Se sobreescribió el campo '${trace}${prop}' de la ruta '${routePath}'
  con el valor que se encuentra en el middleware '${middlewareName}', se recomienda declarar este
  campo solamente en el middleware.`
        console.log(message)
      }
      destiny[prop] = origin[prop]
    }
  }

  /**
  * Actualiza los fields de tipo THIS, con su valor real.
  * @param {Object} options Atributo de la propiedad output de la ruta.
  * @param {Model} model Modelo con el que se verificarán los campos.
  * @param {String} trace Cadena de texto que almacena dirección del field,
  * es util en caso de encontrar un error.
  * @param {Model[]} models Colección de modelos.
  */
  _updateValueOfTHIS(options, model, trace, models) {
    if (Array.isArray(options)) {
      return this._updateValueOfTHIS(options[0], model, trace, models)
    }
    for (let prop in options) {
      let field = options[prop]
      if (field instanceof Field) {
        continue
      }
      // Actualiza el valor de los campos que tengan el valor Field.THIS
      if ((typeof field == 'function') && (field.name == 'THIS')) {
        if (typeof model == 'undefined') {
          throw new Error(`El campo '${trace}${prop}' requiere el atributo 'options.model'`)
        }
        if(!model.fields[prop]) {
          throw new Error(`El campo '${trace}${prop}' no es parte del modelo '${model.name}'`)
        }
        options[prop] = field(model.fields[prop])
        continue
      }
      // Por defecto todos los objetos declarados en la ruta deberían ser válidos
      if (typeof field == 'object') {
        let fieldPath = `${trace}${prop}.`
        let resultPropModel = model.getModelOfProperty(prop, models)
        this._updateValueOfTHIS(options[prop], resultPropModel.model, fieldPath, models)
        continue
      } else {
        throw new Error(`El valor del campo '${trace}${prop}' es inválido`)
      }
    }
  }

  /**
  * Devuelve una lista de funciones de tipo callback que realizan tareas
  * de validación, contienen los middlewares y finalmente el controlador de la ruta.
  * @param {Model[]} models Modelos de la aplicación.
  * @param {Object} db Objeto que contiene todos los modelos sequelize,
  * una instancia y una referencia de la clase Sequelize.
  * @return {Function[]}
  */
  getCallback(models, db) {
    let callbacks = []

    // Callback que valida los datos de entrada.
    callbacks.push(this.validatorCallback())

    // Callbacks de los middlewares
    for (let i in this.middlewares) {
      let middleware = this.middlewares[i]
      callbacks.push(middleware.callback)
    }

    // Objeto que se encarga de controlar que el resultado sea tal como se describe en la ruta.
    let outputManager = new OutputManager()
    outputManager.init(this, models, db)

    // Callback del controlador de la ruta.
    callbacks.push(this.routeCallback(outputManager, models, db))

    // Callback que verifica el resultado devuelto por el controlador de la ruta.
    callbacks.push(this.responseCallback(outputManager))

    return callbacks
  }

  /**
  * Devuelve una función de tipo callback que valida todos los datos de entrada.
  * @return {Function}
  */
  validatorCallback() {
    return (req, res, next) => {
      try {
        let finalHeaders = this._validate(this.input.headers, req.headers, 'encabezado', '')
        let finalParams = this._validate(this.input.params, req.params, 'parámetro', '')
        let finalBody = this._validate(this.input.body, req.body, 'campo', '')
        req.headers = (typeof finalHeaders != 'undefined') ? finalHeaders : {}
        req.params = (typeof finalParams != 'undefined') ? finalParams : {}
        req.body = (typeof finalBody != 'undefined') ? finalBody : {}
        next()
      } catch(err) {
        res.error422(err.message)
      }
    }
  }

  /**
  * Se encarga de validar los datos de entrada, en base a la propiedad output de la ruta.
  * @param {Object} base Atributo de la propiedad output de la ruta.
  * @param {Object} data Objeto que contiene los datos a verificar.
  * @param {String} type Tipo de propiedad a verificar, se utiliza para mostrar mensajes de error..
  * @param {String} trace Cadena de texto que almacena dirección del field,
  * es util en caso de encontrar un error.
  */
  _validate(base, data, type, trace) {
    if (Array.isArray(base)) {
      if (!Array.isArray(data)) {
        throw new Error(`Se esperaba un array de objetos`)
      }
      let result = []
      for (let i in data) {
        let r = this._validate(base[0], data[i], type, trace)
        if (typeof r != 'undefined') result.push(r)
      }
      return (result.length > 0) ? result : undefined
    }
    let result = {}
    if (typeof data == 'undefined') { data = {} }
    for (let prop in base) {

      let field = base[prop]
      if (field instanceof Field) {
        let str = data[prop]
        let resultValidate = field.validate(str)
        //console.log(`Validando el campo ${prop} = ${str}, ISVALID ? `, resultValidate.isValid);
        if (!resultValidate.isValid) {
          throw new Error(`El ${type} (${trace}${prop})=(${str}) es inválido. ${resultValidate.message}`)
        } else {
          if (typeof resultValidate.value != 'undefined') {
            result[prop] = resultValidate.value
          }
        }
      } else {
        trace += `${prop}.`
        let r = this._validate(base[prop], data[prop], type, trace)
        if (typeof r != 'undefined') {
          result[prop] = r
        }
      }
    }
    return (Object.keys(result).length > 0) ? result : undefined
  }

  /**
  * Devuelve una función de tipo callback que resuelve el resultado del controlador de la ruta.
  * @param {OutputManager} outputManager Objeto que se encarga de controlar los resultados.
  * @param {Model[]} models Colección de moelos.
  * @param {Object} db Objeto que contiene modelos sequelize.
  * @return {Function} Función de tipo callback.
  */
  routeCallback(outputManager, models, db) {
    return (req, res, next) => {
      req.options = outputManager.getOptions(req, this, models)
      let result = this.controller(req)
      if ((typeof result == 'object') && (typeof result.then != 'undefined')) {
        // El resultado es una instancia de la clase Promise, con la propiedad then
        return result.then(finalResult => {
          outputManager.setResult(finalResult)
          return next()
        }).catch(err => {
          return res.error(err)
        })
      } else if ((typeof result == 'object') && (typeof result.catch != 'undefined')) {
        // El resultado es una instancia de la clase Promise, con la propiedad catch
        return result.catch(err => {
          res.error(err)
        })
      } else {
        // Cualquier otro resultado se considera como resultado final
        outputManager.setResult(result)
        return next()
      }
    }
  }

  /**
  * Devuelve una función de tipo callback que verifica el resultado final.
  * @param {OutputManager} outputManager Objeto que se encarga de controlar los resultados.
  * @return {Function}
  */
  responseCallback(outputManager) {
    return (req, res, next) => {
      if (this.method == 'POST') {
        return res.success201(outputManager.getResult())
      } else {
        return res.success200(outputManager.getResult())
      }
    }
  }

}

module.exports = Route
