'use strict'
/** @ignore */ const Field = require('./Field')

/**
* Clase que permite administrar el formato de respuesta de las peticiones
*/
class ResponseManager {

  /**
  * Crea una instancia del objeto ResponseManager.
  * @param {Object} [config={}] - Configuración del servidor.
  * @param {Boolean} [config.all200=false] - Indica si el código de respuesta de todas las peticiones será 200 (OK).
  */
  constructor(config = {}) {
    /**
    * Indica si el código de respuesta de todas las peticiones será 200 (OK).
    * @type {Object}
    * @property {Boolean} Indica si el código de respuesta de todas las peticiones será 200 (OK).
    */
    this.config = {
      all200: ((typeof config.all200 != 'undefined') ? config.all200 : false)
    }
  }

  success200(data = { msg: 'Tarea completada exitosamente' }) {
    let code = (this._config_.all200) ? 200 : 200
    this.status(code).json(ResponseManager.formatSuccessJSON(200, data))
  }

  success201(data = { msg: 'Registro creado exitosamente' }) {
    let code = (this._config_.all200) ? 200 : 201
    this.status(code).json(ResponseManager.formatSuccessJSON(201, data))
  }

  error401(msg = 'Acceso no autorizado') {
    let code = (this._config_.all200) ? 200 : 401
    this.status(code).json(ResponseManager.formatErrorJSON(401, 'AUTHENTICATION_ERROR', msg))
  }

  error403(msg = 'Acceso denegado') {
    let code = (this._config_.all200) ? 200 : 403
    this.status(code).json(ResponseManager.formatErrorJSON(403, 'ACCESS_ERROR', msg))
  }

  error404(msg = 'No existe el recurso') {
    let code = (this._config_.all200) ? 200 : 404
    this.status(code).json(ResponseManager.formatErrorJSON(404, 'NOT_FOUND', msg))
  }

  error422(msg = 'Algunos datos no son válidos') {
    let code = (this._config_.all200) ? 200 : 422
    this.status(code).json(ResponseManager.formatErrorJSON(422, 'VALIDATION_ERROR', msg))
  }

  error500(msg = 'Error en el servidor', stack) {
    console.log(stack ? stack : `SERVER_ERROR: ${msg}`)
    let code = (this._config_.all200) ? 200 : 500
    this.status(code).json(ResponseManager.formatErrorJSON(500, 'SERVER_ERROR'))
  }

  error(err) {
    // Maneja todos los errores de instancia Error
    if (err instanceof Error) {
      return this.error500(err.message, err.stack)
    }
    // Maneja todos los posibles errores de sequelize
    if (err.name == 'SequelizeForeignKeyConstraintError') {
      let detail = err.parent.detail
      let a = detail.indexOf('(')
      let b = detail.lastIndexOf(')')
      let field = detail.substr(a, (b-a+1))
      let message = `No existe el registro con el campo ${field}`
      return this.error422(message)
    }
    if (err.name == 'SequelizeUniqueConstraintError') {
      let fields = "", tableName = err.parent.table
      for (let fieldName in err.fields) {
        let value = err.fields[fieldName]
        fields += `, (${fieldName})=(${value})`
      }
      fields = fields.substr(2)
      let message
      if (Object.keys(err.fields).length > 1) {
        message = `Ya existe un registro '${tableName}' con los campos '${fields}' y debe ser único`
      } else {
        message = `Ya existe un registro '${tableName}' con el campo '${fields}' y debe ser único`
      }
      return this.error422(message)
    }
    // Cualquier otro tipo de error devuelve 500 (Server Error)
    let msg = (err && err.msg) ? err.msg : (typeof err == 'string') ? err : undefined
    let stack = (err && err.stack) ? err.stack : undefined
    return this.error500(msg, stack)
  }

  assignTo(res) {
    res._config_ = this.config
    res._success200 = this.success200
    res._success201 = this.success201
    res.error401 = this.error401
    res.error403 = this.error403
    res.error404 = this.error404
    res.error422 = this.error422
    res.error500 = this.error500
    res.error = this.error
  }

  /**
  * Formato JSON de una respuesta exitosa.
  * @param {Number} [code] Código de respuesta (Ej.: 200, 401, etc).
  * @param {Object} [data] Datos a incluir en la respuesta.
  * @return {Object}
  */
  static formatSuccessJSON(code, data) {
    return {
      status: 'OK',
      code: code,
      data: data
    }
  }

  /**
  * Formato JSON de una respuesta de error.
  * @param {Number} [code] Código de respuesta (Ej.: 200, 401, etc).
  * @param {String} [type] Tipo de error..
  * @param {String} [msg] Mensaje a incluir en la respuesta.
  * @return {Object}
  */
  static formatErrorJSON(code, type, msg) {
    return {
      status: 'FAIL',
      code: code,
      type: type,
      msg: msg
    }
  }

  createSuccess(req, res, route, models) {
    res.success200 = (data) => {
      try {
        if (!data) { return res._success200() }
        let outputTemplate = this._outputTemplate(req.query.fields, route, models)
        let finalResult = this._intersect(outputTemplate, data)
        res._success200(finalResult)
      } catch(err) {
        res.error(err)
      }
    }
    res.success201 = (data) => {
      try {
        if (!data) { return res._success201() }
        let outputTemplate = this._outputTemplate(req.query.fields, route, models)
        let finalResult = this._intersect(outputTemplate, data)
        res._success201(finalResult)
      } catch(err) {
        res.error(err)
      }
    }
  }

  // Devuelve el resultado final, a partir de un resultado con todos los datos posibles, la query y el atributo output.
  _intersect(base, objB) {
    let final
    if (typeof objB != 'undefined') {
      if (Array.isArray(base)) {
        final = []
        if (!Array.isArray(objB)) {
          throw new Error(`Se esperaba un array de objetos, se recibió un objeto.`)
        }
      } else {
        final = {}
        if (Array.isArray(objB)) {
          throw new Error(`Se esperaba un objeto, se recibió un array de objetos.`)
        }
      }
      this._copy(base, objB, final)
    }
    return final
  }

  // Copia el valor de data segun el template sobre el objeto final.
  _copy(base, objB, final) {
    if (Array.isArray(base) && (objB.length > 0)) {
      for (let i in objB) {
        let x = this._intersect(base[0], objB[i])
        if (typeof x != 'undefined') {
          final.push(x)
        }
      }
    } else {
      for (let prop in base) {
        if (typeof base[prop] == 'object') {
          if ((typeof objB == 'undefined') || (typeof objB[prop] == 'undefined')) {
            continue
          }
          if(Array.isArray(base[prop])) {
            final[prop] = final[prop] || []
            if (!Array.isArray(final[prop])) {
              final[prop] = [final[prop]]
            }
            this._copy(base[prop], objB[prop], final[prop])
          } else {
            final[prop] = {}
            this._copy(base[prop], objB[prop], final[prop])
          }
        } else {
          if (objB && (typeof objB[prop] != 'undefined')) {
            if (Array.isArray(final[prop])) {
              final[prop] = objB[prop]
            } else {
              final[prop] = objB[prop]
            }
          }
        }
      }
    }
  }

  // Devuelve un template a partir de los filtros y el modelo de salida output.
  _outputTemplate(filter, route, models) {
    let isArray = Array.isArray(route.output)
    let queryOutput = this._queryTemplate(filter, route, models)     // queryOutput
    queryOutput = isArray ? [queryOutput] : queryOutput
    let finalOutput = this._intersect(route.output, queryOutput)
    return finalOutput
  }

  // id,nombre,usuario(id,username,pasword)
  _queryTemplate(query, route, models) {
    query = (query) ? query : 'all'
    let queryTemplate = { }
    // Si no se especifica los campos a devolver, por defecto devuelve todos los campos del modelo.
    while(query.indexOf("()") != -1) {
      query = query.replace("()","(all)")
    }
    // Reemplaza los espacions en blanco
    while(query.indexOf(" ") != -1) {
      query = query.replace(" ","")
    }
    let iniM = 0, finM = 0, iniF = 0, finF = 0, level = 0, modelsQuery = []
    for (let index in query) {
      let c = query[index]
      if (c == ",") {
        finF = parseInt(index) - iniF
        if (finF > 1) {
          let fieldName = query.substr(iniF, finF)
          this._buildTemplateForQuery(fieldName, level, modelsQuery, queryTemplate, route)
        }
        iniF = parseInt(index) + 1
        iniM = parseInt(index) + 1
      }
      if (c == "(") {
        finM = parseInt(index) - iniM
        let as = query.substr(iniM, finM)
        modelsQuery[level] = {model:this._getModelFromAs(as, route.model, models), as:as}
        level++
        iniF = parseInt(index) + 1
        iniM = parseInt(index) + 1
      }
      if (c == ")") {
        finF = parseInt(index) - iniF
        finM = parseInt(index) - iniM
        if (finF > 1) {
          let fieldName = query.substr(iniF, finF)
          this._buildTemplateForQuery(fieldName, level, modelsQuery, queryTemplate, route)
        }
        iniF = parseInt(index) + 1
        iniM = parseInt(index) + 1
        level--
      }
      if ((parseInt(index) == (query.length - 1)) && (iniF < query.length)) {
        let fieldName = query.substr(iniF)
        this._buildTemplateForQuery(fieldName, level, modelsQuery, queryTemplate, route)
      }
    }
    return queryTemplate
  }

  _getModelFromAs(as, model, models) {
    if (models[as]) {
      return models[as]
    }
    for (let j in model.options.associations) {
      let assoc = model.options.associations[j]
      if (assoc.as == as) {
        return models[assoc.model]
      }
    }
    return models[as]
  }

  _buildTemplateForQuery(fieldName, level, modelsQuery, queryTemplate, route) {
    let output = Array.isArray(route.output) ? route.output[0] : route.output
    this._insertar(queryTemplate, 0, level, modelsQuery, fieldName, output)
  }

  _insertar(obj, cnt, level, modelsQuery, fieldName, output) {
    if (cnt >= level) {
      if (fieldName == 'all') {
        for (let prop in output) {
          if (typeof output[prop] != 'object') {
            obj[prop] = Field.THIS
          }
        }
      } else {
        obj[fieldName] = Field.THIS
      }
      return
    }
    let modelQuery = modelsQuery[cnt]
    if (typeof modelQuery != 'undefined') {
      let modelName = modelQuery.model.name
      if (modelQuery.as == modelName) {
        obj[modelName] = obj[modelName] || {}
        this._insertar(obj[modelName], cnt + 1, level, modelsQuery, fieldName, output[modelName])
      } else {
        obj[modelQuery.as] = obj[modelQuery.as] || {}
        if (!Array.isArray(obj[modelQuery.as])) {
          obj[modelQuery.as] = [obj[modelQuery.as]]
        }
        this._insertar(obj[modelQuery.as][0], cnt + 1, level, modelsQuery, fieldName, output[modelQuery.as][0])
      }
    }
  }

}

module.exports = ResponseManager