'use strict'
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
    opt.models = models
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
      let str = req.params[fieldName]
      if (typeof str != 'undefined') {
        if (typeof field.validator != 'undefined') {
          if (field.validator.isValid(str)) {
            opt.input.params[fieldName] = field.validator.getValue(str)
          } else {
            // NO ES VALIDO
            let msg = `El parámetro '(${fieldName})=(${str})' es inválido - ${field.validator.msg}`
            opt.err = msg
            return opt
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
            opt.err = msg
            return opt
          }
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
      if (typeof str != 'undefined') {
        if (typeof field.validator != 'undefined') {
          if (field.validator.isValid(str)) {
            opt.input.body[fieldName] = field.validator.getValue(str)
          } else {
            // NO ES VALIDO
            let msg = `El campo '(${fieldName})=(${str})' es inválido - ${field.validator.msg}`
            opt.err = msg
            return opt
          }
        } else {
          opt.input.body[fieldName] = str
        }
      } else {
        if (!field.allowNull) {
          if (typeof field.defaultValue != 'undefined') {
            opt.input.body[fieldName] = field.defaultValue
          } else {
            let msg = `Se requiere el campo '${fieldName}'`
            opt.err = msg
            return opt
          }
        }
      }
    }
  }
  return opt
}

// Respuetas personalizadas
function assignCustomResponses(res) {
  res.success200 = (data, metadata) => {
    res.status(200).json({staus:'OK', code:200, data:data, metadata:metadata})
  }
  res.success201 = (data) => {
    res.status(201).json({status:'OK', code:201, data:data})
  }
  res.error422 = (msg) => {
    res.status(422).json({status:'FAIL', code:422, msg:msg})
  }
  res.error500 = (err) => {
    res.status(500).json({status:'FAIL', code:500, msg:err})
  }
  res.error = (err) => {
    console.log(err)
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
