'use strict'
const Field = require('./Field')

class InputManager {

  constructor() { }

  validate(req, route) {
    let finalHeaders = this._validate(route.input.headers, req.headers, 'encabezado', '')
    let finalParams = this._validate(route.input.params, req.params, 'parámetro', '')
    let finalBody = this._validate(route.input.body, req.body, 'campo', '')
    req.headers = (typeof finalHeaders != 'undefined') ? finalHeaders : {}
    req.params = (typeof finalParams != 'undefined') ? finalParams : {}
    req.body = (typeof finalBody != 'undefined') ? finalBody : {}
  }

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
        let { isValid, value, msg } = field.validate(str)
        if (!isValid) {
          throw new Error(`El ${type} (${trace}${prop})=(${str}) es inválido. ${msg}`)
        } else {
          if (typeof value != 'undefined') {
            result[prop] = value
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

}

module.exports = InputManager
