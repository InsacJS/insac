'use strict'
/** @ignore */ const Config = require('./Config')
/** @ignore */ const ResponseError = require('../errors/ResponseError')
/** @ignore */ const BadRequestError = require('../errors/BadRequestError')
/** @ignore */ const ForbiddenError = require('../errors/ForbiddenError')
/** @ignore */ const InternalServerError = require('../errors/InternalServerError')
/** @ignore */ const NotFoundError = require('../errors/NotFoundError')
/** @ignore */ const UnauthorizedError = require('../errors/UnauthorizedError')
/** @ignore */ const UnprocessableEntityError = require('../errors/UnprocessableEntityError')

/**
* Clase que describe y controla el formato de respuesta de las peticiones.
*/
class Response {

  /**
  * Crea una instancia del objeto Response.
  * @param {!Object} config - Objeto que contiene las configuraciones.
  */
  constructor(config) {

    /**
    * Objeto que contiene las configuraciones.
    * @type {Object}
    */
    this.config = config
  }

  /**
  * Devuelve el resultado de una petición concluida exitosamente.
  * @param {Object} [data] Datos que se incluyen en la respuesta.
  * @param {Object} [metadata] Información extra que se envía junto con el resultado final.
  */
  success200(data = { message: 'Tarea completada exitosamente' }, metadata) {
    let code = (this.all200) ? 200 : 200
    this.status(code).json(Response.formatSuccessJSON(200, data, metadata))
  }

  /**
  * Devuelve el resultado de la creación exitosa de un nuevo registro.
  * @param {Object} [data] Datos que se incluyen en la respuesta.
  * @param {Object} [metadata] Información extra que se envía junto con el resultado final.
  */
  success201(data = { message: 'Registro creado exitosamente' }, metadata) {
    let code = (this.all200) ? 200 : 201
    this.status(code).json(Response.formatSuccessJSON(201, data, metadata))
  }

  /**
  * Devuelve el resultado de una petición que concluyó con un error de tipo BadRequest.
  * @param {String} [message] Mensaje que detalla el error.
  */
  error400(message = BadRequestError.MESSAGE) {
    let code = (this.all200) ? 200 : 400
    this.status(code).json(Response.formatErrorJSON(400, BadRequestError.TYPE, message))
  }

  /**
  * Devuelve el resultado de una petición que concluyó con un error de tipo UnauthorizedError.
  * @param {String} [message] Mensaje que detalla el error.
  */
  error401(message = UnauthorizedError.MESSAGE) {
    let code = (this.all200) ? 200 : 401
    this.status(code).json(Response.formatErrorJSON(401, UnauthorizedError.TYPE, message))
  }

  /**
  * Devuelve el resultado de una petición que concluyó con un error de tipo ForbiddenError.
  * @param {String} [message] Mensaje que detalla el error.
  */
  error403(message = ForbiddenError.MESSAGE) {
    let code = (this.all200) ? 200 : 403
    this.status(code).json(Response.formatErrorJSON(403, ForbiddenError.TYPE, message))
  }

  /**
  * Devuelve el resultado de una petición que concluyó con un error de tipo NotFoundError.
  * @param {String} [message] Mensaje que detalla el error.
  */
  error404(message = NotFoundError.MESSAGE) {
    let code = (this.all200) ? 200 : 404
    this.status(code).json(Response.formatErrorJSON(404, NotFoundError.TYPE, message))
  }

  /**
  * Devuelve el resultado de una petición que concluyó con un error de tipo UnprocessableEntityError.
  * @param {String} [message] Mensaje que detalla el error.
  */
  error422(message = UnprocessableEntityError.MESSAGE) {
    let code = (this.all200) ? 200 : 422
    this.status(code).json(Response.formatErrorJSON(422, UnprocessableEntityError.TYPE, message))
  }

  /**
  * Devuelve el resultado de una petición que concluyó con un error de tipo InternalServerError.
  * Cuando se esta en modo productión, no muestra ningún mensaje por consola.
  * @param {String} [message] Mensaje que detalla el error.
  * @param {String} [stack] Contenido adicional que muestra el origen del error.
  */
  error500(message = InternalServerError.MESSAGE, stack) {
    let detail = stack ? stack : `${InternalServerError.TYPE}: ${message}`
    let code = (this.all200) ? 200 : 500
    if (process.env.NODE_ENV == 'production') {
      this.status(code).json(Response.formatErrorJSON(500, InternalServerError.TYPE))
    } else {
      console.log(detail)
      this.status(code).json(Response.formatErrorJSON(500, InternalServerError.TYPE, message))
    }
  }

  /**
  * Devuelve el resultado de una petición que concluyó con un tipo de error no especificado,
  * procesando el error y devolviendo el resultado de error adecuado.
  * Este metodo, reconoce errores que resultan ser instancias de la clase ResponseError,
  * errores de tipo SequelizeError.
  * @param {!Error} err Error ha procesar.
  */
  error(err) {
    // Mensajes de error predefinidos (instancias de la clase ResponseError)
    if (err instanceof ResponseError) {
      if (err.code == 400) { return this.error400(err.message) }
      if (err.code == 401) { return this.error401(err.message) }
      if (err.code == 403) { return this.error403(err.message) }
      if (err.code == 404) { return this.error404(err.message) }
      if (err.code == 422) { return this.error422(err.message) }
      if (err.code == 500) { return this.error500(err.message) }
    }
    // Mensajes de error de sintaxis
    if (err instanceof SyntaxError) { return this.error400(`El formato JSON es incorrecto`) }
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
    let message = (err && err.message) ? err.message : (typeof err == 'string') ? err : undefined
    let stack = (err && err.stack) ? err.stack : undefined
    return this.error500(message, stack)
  }

  /**
  * Adiciona metodos personalizados en el objeto response del servidor.
  * @param {!ExpressResponse} response Objeto response de express
  */
  assignTo(response) {
    response.all200 = this.config.server.all200
    response.success200 = this.success200
    response.success201 = this.success201
    response.error400 = this.error400
    response.error401 = this.error401
    response.error403 = this.error403
    response.error404 = this.error404
    response.error422 = this.error422
    response.error500 = this.error500
    response.error = this.error
  }

  /**
  * Formato JSON de una respuesta exitosa.
  * @param {!Number} code Código de respuesta (Ej.: 200, 401, etc).
  * @param {!Object} data Datos a incluir en la respuesta.
  * @param {Object} [metadata] Información extra que se incluye en la respuesta.
  * @return {Object}
  */
  static formatSuccessJSON(code, data, metadata) {
    let result = {
      status: 'OK',
      code: code,
      data: data
    }
    if (typeof metadata != 'undefined') { result.metadata = metadata }
    return result
  }

  /**
  * Formato JSON de una respuesta de error.
  * @param {!Number} code Código de respuesta (Ej.: 200, 401, etc).
  * @param {!String} type Tipo de error..
  * @param {!String} message Mensaje a incluir en la respuesta.
  * @return {Object}
  */
  static formatErrorJSON(code, type, message) {
    return {
      status: 'FAIL',
      code: code,
      type: type,
      message: message
    }
  }

}

Response.errors = {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError
}

module.exports = Response
