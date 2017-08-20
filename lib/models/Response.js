'use strict'

const Config = require('../config/Config')

class Response {

  static success200(data, metadata) {
    let responseData = {
      status: 'OK',
      code: 200,
      data: data
    }
    if (metadata) responseData.metadata = metadata
    this.status = (Config.response.all200) ? 200 : responseData.code,
    this.json(responseData)
  }

  static success201(data, metadata) {
    let responseData = {
      status: 'OK',
      code: 201,
      data: data
    }
    if (metadata) responseData.metadata = metadata
    this.status = (Config.response.all200) ? 200 : responseData.code,
    this.json(responseData)
  }

  static error401(msg = 'Acceso no autorizado') {
    let responseData = {
      status: 'FAIL',
      code: 401,
      msg: msg
    }
    this.status = (Config.response.all200) ? 200 : responseData.code,
    this.json(responseData)
  }

  static error403(msg = 'Acceso denegado') {
    let responseData = {
      status: 'FAIL',
      code: 403,
      msg: msg
    }
    this.status = (Config.response.all200) ? 200 : responseData.code,
    this.json(responseData)
  }

  static error404(msg = 'No existe el registro') {
    let responseData = {
      status: 'FAIL',
      code: 404,
      msg: msg
    }
    this.status = (Config.response.all200) ? 200 : responseData.code,
    this.json(responseData)
  }

  static error422(msg = 'Algunos datos no son válidos') {
    let responseData = {
      status: 'FAIL',
      code: 422,
      msg: msg
    }
    this.status = (Config.response.all200) ? 200 : responseData.code,
    this.json(responseData)
  }

  static error500(err) {
    console.log(err)
    let responseData = {
      status: 'FAIL',
      code: 500,
      err: err
    }
    this.status = (Config.response.all200) ? 200 : responseData.code,
    this.json(responseData)
  }

  static error(err, msg) {
    let message;
    switch (err.name) {
      case 'SequelizeForeignKeyConstraintError':
        let detail = err.parent.detail
        let a = detail.indexOf('(')
        let b = detail.lastIndexOf(')')
        let field = detail.substr(a, (b-a+1))
        message = `No existe el registro con el campo ${field}`
        return this.error422(msg || message)
      case 'SequelizeUniqueConstraintError':
        let fields = "", tableName = err.parent.table
        for (let fieldName in err.fields) {
          let value = err.fields[fieldName]
          fields += `, (${fieldName})=(${value})`
        }
        fields = fields.substr(2)
        if (Object.keys(err.fields).length > 1) {
          message = `Ya existe un registro '${tableName}' con los campos '${fields}' y debe ser único`
        } else {
          message = `Ya existe un registro '${tableName}' con el campo '${fields}' y debe ser único`
        }
        return this.error422(msg || message)
      default:
        console.log(err)
        return this.error500(err)
    }
  }

  static assignTo(response) {
    response.success200 = this.success200
    response.success201 = this.success201
    response.error401 = this.error401
    response.error403 = this.error403
    response.error404 = this.error404
    response.error422 = this.error422
    response.error500 = this.error500
    response.error = this.error
  }

}

module.exports = Response
