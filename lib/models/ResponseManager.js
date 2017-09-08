'use strict'
/** @ignore */ const Field = require('./Field')

class NotFoundError extends Error {
  constructor(resource, field, value) {
    let msg = `No existe el registro`
    if (arguments.length == 1) { msg = `No existe el registro '${resource}'` }
    if (arguments.length == 2) { msg = `No existe el registro '${resource}' con el campo '(${field})'` }
    if (arguments.length == 3) { msg = `No existe el registro '${resource}' con el campo '(${field})=(${value})'` }
    super(msg)
    this.code = 404
  }
}

class ValidationError extends Error {
  constructor(msg) {
    super(msg)
    this.code = 404
  }
}

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
    if (err instanceof NotFoundError) {
      return this.error404(err.message)
    }
    if (err instanceof ValidationError) {
      return this.error422(err.message)
    }
    // Maneja todos los posibles errores de sequelize
    if (err.name == 'SequelizeForeignKeyConstraintError') {
      let message = `Restricción de clave foranea`
      if (err.message.startsWith('update or delete')) {
        message = `No se puede eliminar el registro '${err.table}', porque esta asociado con otro registro.`
      }
      if (err.message.startsWith('insert or update')) {
        message = `No se puede crear o actualizar el registro '${err.table}', porque el registro al que intenta referenciar no existe.`
      }
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

  createSuccessAndOptions(req, res, route, models, options) {
    let outputTemplate = this._outputTemplate(req.query.fields, route, models)
    let finalOptions = this._optimizeOptions(outputTemplate, options)
    req.options = finalOptions
    res.success200 = (data) => {
      if (!data) { return res._success200() }
      let finalResult = this._intersect(outputTemplate, data)
      res._success200(finalResult)
    }
    res.success201 = (data) => {
      if (!data) { return res._success201() }
      let finalResult = this._intersect(outputTemplate, data)
      res._success201(finalResult)
    }
  }

  _optimizeOptions(outputTemplate, options) {
    let finalOptions = {
      attributes: ['id']
    }
    if (Array.isArray(outputTemplate)) {
      outputTemplate = outputTemplate[0]
    }
    let include = []
    for(let prop in outputTemplate) {
      if (outputTemplate[prop] instanceof Field) {
        finalOptions.attributes.push(prop)
      } else {
        for (let j in options.include) {
          let as = options.include[j].as
          if (options.include[j].as == prop) {
            let opt = this._optimizeOptions(outputTemplate[prop], options.include[j])
            opt.as = options.include[j].as
            opt.model = options.include[j].model
            opt.attributes.push('id')
            include.push(opt)
          }
        }
      }
    }
    if (include.length > 0) finalOptions.include = include
    return finalOptions
  }

  // Devuelve el resultado final, a partir de un resultado con todos los datos posibles, la query y el atributo output.
  _intersect(base, objB) {
    let final
    if (typeof objB != 'undefined') {
      if (Array.isArray(base)) {
        final = []
        if (!Array.isArray(objB)) {
          throw new Error(`Se esperaba un array de objetos`)
        }
      } else {
        final = {}
        if (Array.isArray(objB)) {
          throw new Error(`Se esperaba un objeto`)
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
        if (!(base[prop] instanceof Field)) {
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
    let queryOutput = this._queryTemplate(filter, route, models)     // queryOutput
    if (Array.isArray(route.output)) {
      queryOutput = [queryOutput]
    }
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
    // Reemplaza los espacios en blanco
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
        let modelQuery = this._getModelFromAs(as, route.model, models)
        // Si no existe un modelo, referencia o asociación especificada en la query, se detiene toda la operación
        if (!modelQuery) { break }
        modelsQuery[level] = {model:modelQuery, as:as}
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
    for (let i in model.options.associations) {
      let assoc = model.options.associations[i]
      if (assoc.as == as) {
        return models[assoc.model]
      }
    }
    return models[as]
  }

  _buildTemplateForQuery(fieldName, level, modelsQuery, queryTemplate, route) {
    let output = Array.isArray(route.output) ? route.output[0] : route.output
    this._insertar(queryTemplate, 0, level, modelsQuery, fieldName, output, route.model)
  }

  _insertar(obj, cnt, level, modelsQuery, fieldName, output, rootModel) {
    if (cnt >= level) {
      if (fieldName == 'all') {
        for (let prop in output) {
          if (output[prop] instanceof Field) {
            obj[prop] = output[prop]
          }
        }
      } else {
        if (level == 0) {
          // Si el campo fieldName es un campo válido del modelo rootModel
          if (!rootModel.fields[fieldName]) {
            throw new ValidationError(`EL campo '${fieldName}' no es parte del modelo '${rootModel.name}'`)
          }
        } else {
          // Si el campo fieldName es un campo válido del modelo modelsQuery[cnt - 1].model
          if (!modelsQuery[cnt - 1].model.fields[fieldName]) {
            throw new ValidationError(`El campo '${fieldName}' no es parte del modelo '${modelsQuery[cnt - 1].model.name}'`)
          }
        }
        obj[fieldName] = output[fieldName]
      }
      return
    }
    let modelQuery = modelsQuery[cnt]
    if (typeof modelQuery != 'undefined') {
      let modelName = modelQuery.model.name
      if (modelQuery.as == modelName) {
        obj[modelName] = obj[modelName] || {}
        this._insertar(obj[modelName], cnt + 1, level, modelsQuery, fieldName, output[modelName], rootModel)
      } else {
        obj[modelQuery.as] = obj[modelQuery.as] || {}
        if (!Array.isArray(obj[modelQuery.as])) {
          obj[modelQuery.as] = [obj[modelQuery.as]]
        }
        this._insertar(obj[modelQuery.as][0], cnt + 1, level, modelsQuery, fieldName, output[modelQuery.as][0], rootModel)
      }
    }
  }

}

ResponseManager.NotFoundError = NotFoundError

module.exports = ResponseManager
