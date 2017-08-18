'use strict'
const Field = require('./Field')

class Route {

  constructor(method, path, options) {
    this.method = method
    this.path = path
    this.model = options.model
    this.version = options.version || 1
    this.roles = options.roles
    this.input = {}
    if (options.input) {
      this.input = {
        headers: options.input.headers || {},
        params: options.input.params || {},
        body: options.input.body || {}
      }
    }
    this.output = {
      metadata: {},
      data: {}
    }
    if (options.output) {
      this.output = {
        metadata: options.output.metadata,
        data: options.output.data
      }
    }
    if (!options.output && method == 'POST') {
      this.output = {
        data: this.model.fields
      }
    }
    this.middlewares = options.middlewares || []
    this.controller = options.controller
  }

  createOptMiddleware(insac) {
    return (req, res, opt, next) => {
      try {
        createOPT(this, insac.models, req, opt)
      } catch(err) {
        return res.error422(err.toString())
      }
      next()
    }
  }
  
}

module.exports = Route

function createOPT(route, models, req, opt) {
  opt.roles = route.roles
  opt.model = route.model
  opt.input = {
    headers: {},
    params: {},
    body: {}
  }
  opt.output = {
    metadata: route.output.metadata,
    data: route.output.data
  },
  opt.models = models
  opt.getModel = (modelName) => {
    for (let i in models) {
      if (models[i].options.singular == modelName || models[i].options.plural == modelName) {
        return models[i]
      }
    }
  }
  opt.data = {}

  // Validación input - headers
  for (let fieldName in route.input.headers) {
    let field = route.input.headers[fieldName]
    if (!(field instanceof Field)) {
      continue
    }
    let str = req.headers[fieldName]
    if (typeof str != 'undefined') {
      if ((typeof field.validator != 'undefined') && (field.validator != null)) {
        if (field.validator.isValid(str)) {
          opt.input.headers[fieldName] = field.validator.getValue(str)
        } else {
          let msg = `El encabezado '(${fieldName})=(${str})' es inválido - ${field.validator.msg}`
          throw new Error(msg)
        }
      } else {
        opt.input.headers[fieldName] = str
      }
    } else {
      if (!field.allowNull) {
        if (typeof field.defaultValue != 'undefined') {
          opt.input.headers[fieldName] = field.defaultValue
        } else {
          let msg = `Se requiere el encabezado '${fieldName}'`
          throw new Error(msg)
        }
      }
    }
  }

  // Validación input - params
  for (let fieldName in route.input.params) {
    let field = route.input.params[fieldName]
    if (!(field instanceof Field)) {
      continue
    }
    let str = req.params[fieldName]
    if (typeof str != 'undefined') {
      if ((typeof field.validator != 'undefined') && (field.validator != null)) {
        if (field.validator.isValid(str)) {
          opt.input.params[fieldName] = field.validator.getValue(str)
        } else {
          let msg = `El parámetro '(${fieldName})=(${str})' es inválido - ${field.validator.msg}`
          throw new Error(msg)
        }
      } else {
        opt.input.params[fieldName] = str
      }
    } else {
      if (!field.allowNull) {
        if (typeof field.defaultValue != 'undefined') {
          opt.input.params[fieldName] = field.defaultValue
        } else {
          let msg = `Se requiere el campo '${fieldName}'`
          throw new Error(msg)
        }
      }
    }
  }
  // Validación input - body
  //console.log("INPUT: ", route.input.body)
  if (Array.isArray(route.input.body)) {
    opt.input.body = []
    if (!Array.isArray(req.body) || (req.body.length == 0)) {
      let msg = `Se requiere un array de objetos`
      throw new Error(msg)
    }
    for (let i in req.body) {
      opt.input.body[i] = {}
      for (let fieldName in route.input.body[0]) {
        let field = route.input.body[0][fieldName]
        if (Array.isArray(field)) {
          console.log(field, "is Array 1")
        }
        assignValue(route, opt.input.body[i], field, req.body[i] , fieldName, fieldName)
      }
    }
  } else {
    for (let fieldName in route.input.body) {
      let field = route.input.body[fieldName]
      if (Array.isArray(field)) {
        console.log(field, "is Array 2")
      }
      assignValue(route, opt.input.body, field, req.body, fieldName, fieldName)
    }
  }
  return opt
}

function assignValue(route, obj, field, req, fieldName, fieldFullName) {
  if (field instanceof Field) {
    let fieldName = field.name
    let str = req[fieldName]
    if (typeof str != 'undefined') {
      if ((typeof field.validator != 'undefined') && (field.validator != null)) {
        if (field.validator.isValid(str)) {
          obj[fieldName] = field.validator.getValue(str)
        } else {
          let fieldNameFull = fieldFullName
          let msg = `El campo '(${fieldNameFull})=(${str})' es inválido - ${field.validator.msg}`
          throw new Error(msg)
        }
      } else {
        obj[fieldName] = str
      }
    } else {
      if (route.method == 'POST') {
        if (!field.allowNull) {
          if (typeof field.defaultValue != 'undefined') {
            obj[fieldName] = field.defaultValue
          } else {
            let fieldNameFull = fieldFullName
            let msg = `Se requiere el campo '${fieldNameFull}'`
            throw new Error(msg)
          }
        }
      }
    }
  } else {
    obj = obj[fieldName] = obj[fieldName] || {}
    if (req[fieldName]) {
      req = req[fieldName] = req[fieldName]
      for (let prop in field) {
        let f = field[prop]
        let fieldFullName2 = `${fieldFullName}.${prop}`
        assignValue(route, obj, f, req, prop, fieldFullName2)
      }
    } else {
      if (route.method == 'POST') {
        let msg = `Se requiere el objeto '${fieldFullName}'`
        throw new Error(msg)
      }
    }
  }
}
