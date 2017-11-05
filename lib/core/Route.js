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
    * Grupo al que pertenece la ruta, en caso de no estar asignado a un modelo.
    * @type {String}
    */
    this.group = properties.group

    /**
    * Rol asignado a esta ruta.
    * @type {String}
    */
    this.rol = properties.rol

    /**
    * descripción de la ruta.
    * @type {String}
    */
    this.description = properties.description

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
    * @type {String[]} middlewares
    */
    this.middlewares = properties.middlewares || []

    /**
    * Controlador de la ruta.
    * @type {Function}
    */
    this.controller = properties.controller

    /**
    * Título de la ruta.
    * @type {String}
    */
    this.title = properties.title
  }

  /**
  * Devuelve un identificador único de la ruta, se toma en cuenta el método, la versión y la uri.
  * @return {String}
  */
  ID() {
    switch (this.method) {
    case 'GET':     return `[GET]    v${this.version} ${this.path}`
    case 'POST':    return `[POST]   v${this.version} ${this.path}`
    case 'PUT':     return `[PUT]    v${this.version} ${this.path}`
    case 'DELETE':  return `[DELETE] v${this.version} ${this.path}`
    }
  }

  /**
  * Verifica que todos los datos sean válidos y lo actualiza según sea necesario.
  * Actualiza los middlewares.
  * @param {!Insac} app Instancia de la aplicación.
  */
  init(app) {
    this.model = (typeof this.model == 'string') ? app.models[this.model] : this.model
    if (!this.title && this.model) {
      if (this.method == 'GET') {
        this.title = (!this.input.params.id) ? `listar${this.model.getPluralName()}` : `obtener${this.model.getName()}`
      }
      if (this.method == 'POST') this.title = `crear${this.model.getName()}`
      if (this.method == 'PUT') this.title = `actualizar${this.model.getName()}`
      if (this.method == 'DELETE') this.title = `eliminar${this.model.getName()}`
    }

    // Actualiza los campos THIS.
    this._updateValueOfTHIS(this.input.headers, this.model, 'input.headers.', app.models)
    this._updateValueOfTHIS(this.input.params, this.model, 'input.params.', app.models)
    this._updateValueOfTHIS(this.input.body, this.model, 'input.body.', app.models)
    this._updateValueOfTHIS(this.output, this.model, 'output.', app.models)
    // Actualiza los campos de la propiedad output de la ruta, por defecto required = false.
    // Los campos a devolver de una ruta son opcionales, ya que se enviarán
    // unicamente los campos que el cliente requiera.
    this._updateProperties(this.output, {required:false})
    // Adiciona la propiedad callback a cada middleware de la colección.
    // Incorpora los campos que el middleware requiere sobre esta ruta.
    let middlewareFunctions = []
    for (let i in this.middlewares) {
      let middlewareName = this.middlewares[i]
      // Si el objeto es una función, se considerará como el callback del middleware.
      // Una función de la forma: (req, res, next) => { next() }
      if (typeof middlewareName == 'function') {
        continue
      }
      // En cualquier otro caso, se supone que es un objeto con los campos: name y args.
      // Se buscará el middleware con el nombre name en la colección de middlewares de la aplicación
      if (typeof app.middlewares[middlewareName] == 'undefined') {
        let msg = `No existe el middleware '${middlewareName}'.\nRuta: ${this.ID()}`
        throw new Error(msg)
      }
      // Se ejecuta la función que devuelve una instancia Middleware, enviándole los argumentos args.
      let middleware = app.middlewares[middlewareName]
      let routePath = this.ID()
      // Se copian todas las propiedades que requiere el middleware dentro de esta ruta.
      this._copyMiddlewarePropertiesOnRoute(middleware.input.headers, this.input.headers, 'input.headers.', routePath, middlewareName)
      this._copyMiddlewarePropertiesOnRoute(middleware.input.params, this.input.params, 'input.params.', routePath, middlewareName)
      this._copyMiddlewarePropertiesOnRoute(middleware.input.body, this.input.body, 'input.body.', routePath, middlewareName)

      // Se crea la propiedad callback (una función de la forma (req, res, next) => { next() })
      middlewareFunctions.push(middleware.getCallback())
    }
    this.middlewares = middlewareFunctions
  }

  /**
  * Copia las propiedades del middleware sobre la ruta.
  * @param {!Object} origin Objeto que representa una propiedad del middleware.
  * @param {!Object} destiny Objeto que representa una propiedad de la ruta.
  * @param {!String} trace Cadena de texto que va almacenando la ruta de la propiedad.
  * @param {!String} routePath Nombre que identifica a la ruta.
  * @param {!String} middlewareName Nombre del middleware.
  */
  _copyMiddlewarePropertiesOnRoute(origin, destiny, trace, routePath, middlewareName) {
    for (let prop in origin) {
      destiny[prop] = origin[prop]
    }
  }

  /**
  * Actualiza los fields de tipo THIS, con su valor real.
  * @param {!Object} obj Atributo de la propiedad output de la ruta.
  * @param {!Model} model Modelo con el que se verificarán los campos.
  * @param {!String} trace Cadena de texto que almacena dirección del field,
  * es util en caso de encontrar un error.
  * @param {!Model[]} models Colección de modelos.
  */
  _updateValueOfTHIS(obj, model, trace, models) {
    if (Array.isArray(obj)) {
      return this._updateValueOfTHIS(obj[0], model, trace, models)
    }
    for (let prop in obj) {
      let field = obj[prop]
      if (field instanceof Field) {
        continue
      }
      // Actualiza el valor de los campos que tengan el valor Field.THIS
      if ((typeof field == 'function') && (field.name == 'THIS')) {
        if (typeof model == 'undefined') {
          let msg = `El campo '${trace}${prop}' requiere que la propiedad 'model' este definida dentro de la ruta ${this.ID()}`
          throw new Error(msg)
        }
        if(!model.fields[prop]) {
          let msg = `El campo '${trace}${prop}' no es parte del modelo '${model.name}' Ruta: ${this.ID()}`
          throw new Error(msg)
        }
        obj[prop] = field(model.fields[prop])
        continue
      }
      // Por defecto todos los objetos declarados en la ruta deberían ser válidos
      if (typeof field == 'object') {
        let fieldPath = `${trace}${prop}.`
        let resultPropModel = model ? model.getModelOfProperty(prop, models) : { model:undefined }
        this._updateValueOfTHIS(obj[prop], resultPropModel.model, fieldPath, models)
        continue
      } else {
        let msg = `El valor del campo '${trace}${prop}' es inválido. Ruta: ${this.ID()}`
        throw new Error(msg)
      }
    }
  }

  /**
  * Actualiza todas las propiedades de los fields de la propiedad input u output de una ruta.
  * @param {!Object} obj Propiedad input u output de una ruta.
  * @param {!Object} properties Propiedades a modificar.
  */
  _updateProperties(obj, properties) {
    if (Array.isArray(obj)) {
      return this._updateProperties(obj[0], properties)
    }
    for (let prop in obj) {
      let field = obj[prop]
      if (field instanceof Field) {
        field.update(properties)
        continue
      }
      if (typeof field == 'object') {
        this._updateProperties(obj[prop], properties)
      }
    }
  }

  /**
  * Devuelve una lista de funciones de tipo callback que realizan tareas
  * de validación, contienen los middlewares y finalmente el controlador de la ruta.
  * @param {!Model[]} models Modelos de la aplicación.
  * @param {!Object} db Objeto que contiene todos los modelos sequelize,
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
      callbacks.push(middleware)
    }

    // Objeto que se encarga de controlar que el resultado sea tal como se describe en la ruta.
    let outputManager = new OutputManager()
    outputManager.init(this, models, db)

    // Callback del controlador de la ruta.
    callbacks.push(this.routeCallback(outputManager))

    // Callback que verifica el resultado devuelto por el controlador de la ruta.
    callbacks.push(this.responseCallback(outputManager, this, db))

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
  * @param {!Object} base Atributo de la propiedad output de la ruta.
  * @param {!Object} data Objeto que contiene los datos a verificar.
  * @param {!String} type Tipo de propiedad a verificar, se utiliza para mostrar mensajes de error..
  * @param {!String} trace Cadena de texto que almacena dirección del field,
  * es util en caso de encontrar un error.
  */
  _validate(base, data, type, trace) {
    if (Array.isArray(base)) {
      if (!Array.isArray(data)) {
        let msg = `Se esperaba un array de objetos`
        throw new Error(msg)
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
        if (!resultValidate.isValid) {
          let msg = `El ${type} (${trace}${prop})=(${str}) es inválido. ${resultValidate.message}`
          if (typeof str == 'undefined') {
            msg = `No se encuentra el ${type} (${trace}${prop}). ${resultValidate.message}`
          }
          throw new Error(msg)
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
  * @param {!OutputManager} outputManager Objeto que se encarga de controlar los resultados.
  * @return {Function} Función de tipo callback.
  */
  routeCallback(outputManager) {
    return (req, res, next) => {
      // Creamos el objeto options para realizar consultas.
      req.options = outputManager.getOptions(req, this)
      //res.success200(req.options)
      // Procesamos la respuesta del controlador.
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
  * @param {!OutputManager} outputManager Objeto que se encarga de controlar los resultados.
  * @param {!Route} route Ruta para el que se verificará el resultado.
  * @param {!Object} db Modelos sequelize.
  * @return {Function}
  */
  responseCallback(outputManager, route, db) {
    return (req, res) => {
      async function task() {
        let metadata, data = outputManager.getResult()
        // Creamos los metadatos en caso de tratarse de un recurso y su resultado sea un array.
        if (route.model && Array.isArray(route.output)) {
          metadata = await outputManager.createMetadata(req, route, db)
          metadata.count = data.length
        }
        // Devolvemos los resultados
        if (route.method == 'POST') {
          res.success201(data, metadata)
        } else {
          res.success200(data, metadata)
        }
        // Liberamos la memoria
        outputManager.data = null
      }
      task()
    }
  }

  /**
  * Devuelve la documentación de la ruta en formato txt.
  * @return {String}
  */
  apidoc() {
    let title = this.rol ? `[${this.rol}] ${this.title}` : this.title
    let apiName = `${title}`
    let api = `{${this.method}} ${this.path} ${title}`
    let apiGroup = this.group ? `${this.group}` : (this.model ? `${this.model.getName()}` : 'Otras rutas')

    let apiVersion = `${this.version}.0.0`
    let apiDescription = this.description

    let apidocContent = `
    /**
    * @api ${api}
    * @apiName ${apiName}
    * @apiGroup ${apiGroup}
    * @apiVersion ${apiVersion}\n`

    if (this.rol) {
      if (Array.isArray(this.rol)) {
        for (let i in this.rol) {
          let rol = this.rol[i]
          apidocContent += `    * @apiPermission ${rol}\n`
        }
      } else {
        apidocContent += `    * @apiPermission ${this.rol}\n`
      }
    }

    if (apiDescription) {
      apidocContent += `    * @apiDescription ${apiDescription}\n`
    }

    for (let prop in this.input.headers) {
      let field = this.input.headers[prop]
      let type = field.apidocType()
      let fieldName = field.apidocProp(prop)
      apidocContent += `    * @apiHeader (Input - header) {${type}} ${fieldName} ${field.description}\n`
    }

    for (let prop in this.input.params) {
      let field = this.input.params[prop]
      let type = field.apidocType()
      let fieldName = field.apidocProp(prop)
      apidocContent += `    * @apiParam (Input - params) {${type}} ${fieldName} ${field.description}\n`
    }

    let createApidoc = (fullprop, obj, apidocProperty, type) => {
      let apidocContent = ''
      if (Array.isArray(obj)) {
        if (fullprop != '') {
          apidocContent += `    * ${apidocProperty} (${type}) {Object[]} ${fullprop} Lista de objetos **${fullprop}**\n`
        }
        apidocContent += createApidoc(fullprop, obj[0], apidocProperty, type)
        return apidocContent
      } else {
        if (fullprop != '') {
          apidocContent += `    * ${apidocProperty} (${type}) {Object} ${fullprop} Datos del objeto **${fullprop}**\n`
        }
      }
      for (let prop in obj) {
        let field = obj[prop]
        let property = (fullprop != '') ? `${fullprop}.${prop}` : prop
        if (field instanceof Field) {
          // Si se trata de un parámetro de salida (output), solamente devolvemos el tipo de dato.
          let typeField = field.apidocType(apidocProperty == '@apiSuccess')
          // Si se trata de un parámetro de salida (output), solo muestra el nombre del campo sin ningún otro argumento.
          let fieldName = (apidocProperty == '@apiSuccess') ? `[${property}]` : field.apidocProp(property)
          apidocContent += `    * ${apidocProperty} (${type}) {${typeField}} ${fieldName} ${field.description}\n`
        } else {
          apidocContent += createApidoc(property, obj[prop], apidocProperty, type)
        }
      }
      return apidocContent
    }

    let createData = (obj, onlyRequired) => {
      let data
      let isArray = Array.isArray(obj)
      if (isArray) {
        return [createData(obj[0], onlyRequired)]
      }
      data = {}
      for (let prop in obj) {
        let field = obj[prop]
        if (field instanceof Field) {
          if (onlyRequired === true) {
            if (field.required) {
              data[prop] = field.example
            }
          } else {
            data[prop] = field.example
          }
        } else {
          data[prop] = createData(obj[prop], onlyRequired)
        }
      }
      return data
    }

    apidocContent += createApidoc('', this.input.body, '@apiParam', 'Input - body')
    let data, responseData, code
    if ((Object.keys(this.input.body).length > 0) || (Array.isArray(this.input.body))) {
      data = createData(this.input.body, false)
      apidocContent += `    * @apiParamExample {json} Ejemplo Petición: Todos los campos posibles\n${JSON.stringify(data, null, 2)}\n`
    }

    apidocContent += createApidoc('', this.output, '@apiSuccess', 'Output - body')
    if ((Object.keys(this.output).length > 0) || (Array.isArray(this.output))) {
      data = createData(this.output, false)
      // Si es un array, por defecto se envia el metadato count.
      responseData = {
        status: 'OK',
        code: (this.method == 'POST') ? 201 : 200,
        data: data
      }
      // Si el dato es un array y la ruta es parte de un recurso
      if (Array.isArray(data) && this.model) {
        responseData.metadata = {
          limit: 50,
          offset: 0,
          total: 1,
          count: 1
        }
      }
      code = (this.method == 'POST') ? '201 Created' : '200 Ok'
      let response = `HTTP/1.1 ${code}`
      apidocContent += `    * @apiSuccessExample {json} Respuesta Exitosa: ${code}\n${response}\n${JSON.stringify(responseData, null, 2)}\n`
    }

    if ((Object.keys(this.input.headers).length > 0) || (Object.keys(this.input.params).length > 0) || (Object.keys(this.input.body).length > 0)) {
      apidocContent += `    * @apiUse error422\n`
    }

    if (this.rol) {
      apidocContent += `    * @apiUse error401\n`
      apidocContent += `    * @apiUse error403\n`
    }

    apidocContent += `    */\n`

    return apidocContent
  }
}

module.exports = Route
