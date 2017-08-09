'use strict'
<<<<<<< HEAD
const Field = require('./Field')

class Route {

  constructor(method, path, options) {
    this.method = method
    this.path = path
    this.model = options.model
    this.version = options.version || 1
    this.input = {}
    if (options.input) {
      this.input = {
        headers: options.input.headers || {},
        params: options.input.params || {},
        body: options.input.body || {}
      }
    }
    this.output = {
      isArray: false,
      metadata: false,
      data: {}
    }
    if (options.output) {
      this.output = {
        isArray: options.output.isArray || false,
        metadata: options.output.metadata || false,
        data: options.output.data
      }
    }
    if (!options.output && method == 'POST') {
      this.output = {
        isArray: false,
        metadata: false,
        data: this.model.fields
      }
    }
    this.controller = options.controller
  }

  createController(models, database) {
    switch (this.method) {
      case 'GET':
        return controllerGET(this, models, database)
        break
      case 'POST':
        return controllerPOST(this, models, database)
        break
      case 'PUT':
        return controllerPUT(this, models, database)
        break
      case 'DELETE':
        return controllerDELETE(this, models, database)
        break
    }
  }

}

module.exports = Route

function controllerGET(route, models, database) {
  return (req, res, next) => {

    // Respuetas personalizadas
    assignCustomResponses(res)
    // Verificación de inputs
    let opt = createOPT(route, req, res)
    if (opt.err) {
      return res.error422(opt.err)
    }

    route.controller(req, res, opt, next)
  }
}

function controllerPOST(route, models, database) {
  return (req, res, next) => {

    // Respuetas personalizadas
    assignCustomResponses(res)
    // Verificación de inputs
    let opt = createOPT(route, req, res)
    if (opt.err) {
      return res.error422(opt.err)
    }

    route.controller(req, res, opt, next)
  }
}

function controllerPUT(route, models, database) {
  return (req, res, next) => {

    // Respuetas personalizadas
    assignCustomResponses(res)
    // Verificación de inputs
    let opt = createOPT(route, req, res)
    if (opt.err) {
      return res.error422(opt.err)
    }

    route.controller(req, res, opt, next)
  }
}

function controllerDELETE(route, models, database) {
  return (req, res, next) => {

    // Respuetas personalizadas
    assignCustomResponses(res)
    // Verificación de inputs
    let opt = createOPT(route, req, res)
    if (opt.err) {
      return res.error422(opt.err)
    }

    route.controller(req, res, opt, next)
  }
}

function createOPT(route, req, res) {
  let opt = {
    model: route.model,
    input: {
      params: {},
      body: {}
    },
    output: {
      isArray: route.output.isArray,
      metadata: route.output.metadata,
      data: route.output.data
    }
  }
  // Validación input - params
  for (let fieldName in route.input.params) {
    if (route.input.params.hasOwnProperty(fieldName)) {
      let field = route.input.params[fieldName]
      if (!(field instanceof Field)) {
        continue
      }
      if (typeof field.validator !== 'undefined') {
        let str = req.params[fieldName]
        if (field.validator.isValid(str)) {
          opt.input.params[fieldName] = field.validator.getValue(str)
        } else {
          // NO ES VALIDO
          let msg = `El campo '(${fieldName})=(${str})' es inválido - ${field.validator.msg}`
          opt.err = msg
          return opt
        }
      }
    }
  }
  // Validación input - body
  for (let fieldName in route.input.body) {
    if (route.input.body.hasOwnProperty(fieldName)) {
      let field = route.input.body[fieldName]
      if (!(field instanceof Field)) {
        continue
      }
      let str = req.body[fieldName]
      if (typeof field.validator !== 'undefined') {
        if (field.validator.isValid(str)) {
          opt.input.body[fieldName] = field.validator.getValue(str)
        } else {
          // NO ES VALIDO
          let msg = `El campo '(${fieldName})=(${str})' es inválido - ${field.validator.msg}`
          if (typeof str == 'undefined') {
            msg = `Se requiere el campo '${fieldName}'`
          }
          opt.err = msg
          return opt
        }
      } else {
        opt.input.body[fieldName] = str
      }
    }
  }
  return opt
}

// Respuetas personalizadas
function assignCustomResponses(res) {
  res.success200 = (data, metadata) => {
    res.status(200).json({staus:'OK', data:data})
  }
  res.success201 = () => {
    res.status(201).json({status:'OK'})
  }
  res.error422 = (msg) => {
    res.status(422).json({status:'FAIL', code:422, msg:msg})
  }
  res.error500 = (err) => {
    res.status(500).json({status:'FAIL', code:500, msg:err})
  }
  res.error = (err) => {
    let msg;
    switch (err.name) {
      case 'SequelizeForeignKeyConstraintError':
        let detail = err.parent.detail
        let a = detail.indexOf('(')
        let b = detail.lastIndexOf(')')
        let field = detail.substr(a, (b-a+1))
        msg = `No existe el registro con el campo ${field}`
        return res.error422(msg)
      case 'SequelizeUniqueConstraintError':
        let fields = "", tableName = err.parent.table
        for (let fieldName in err.fields) {
          let value = err.fields[fieldName]
          fields += `, (${fieldName})=(${value})`
        }
        fields = fields.substr(2)
        if (Object.keys(err.fields).length > 1) {
          msg = `Ya existe un registro '${tableName}' con los campos '${fields}' y debe ser único`
        } else {
          msg = `Ya existe un registro '${tableName}' con el campo '${fields}' y debe ser único`
        }
        return res.error422(msg)
      default:
        return res.error500(err)
    }
  }
}
=======

class Route {

  constructor(uri, method, modelName, idParam, title, version, description, headers, inputs, outputs) {
    this.uri = uri;
    this.method = method;
    this.modelName = modelName;
    this.idParam = idParam;
    this.title = title;
    this.version = version;
    this.description = description;
    this.headers = headers;
    this.inputs = inputs;
    this.outputs = outputs;
  }

  getController(models, database) { }

  static createTitle(method, modelName, idParam) {
    let title;
    switch (method) {
      case 'GET': title = (idParam) ? `Listar ${modelName}` : `Obtener ${modelName}`; break;
      case 'POST': title = `Crear ${modelName}`; break;
      case 'PUT': title = `Actualizar ${modelName}`; break;
      case 'DELETE': title = `Eliminar ${modelName}`; break;
    }
    return title;
  }

  static createDescription(method, modelName, idParam) {
    let description;
    switch (method) {
      case 'GET': description = (idParam) ? `Devuelve un recurso ${modelName}` : `Devuelve una lista de recursos ${modelName}`; break;
      case 'POST': description = `Crea un recurso ${modelName}`; break;
      case 'PUT': description = `Actualiza un recurso ${modelName}`; break;
      case 'DELETE': description = `Elimina un recurso ${modelName}`; break;
    }
    return description;
  }

}

module.exports = Route;
>>>>>>> 5c4152325f93ec9ca023c60fefef5cced0c6a4f7
