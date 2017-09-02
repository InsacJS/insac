'use strict'
/** @ignore */ const { ResponseError } = require('./ResponseError')

/**
* Proporciona funciones para modificar el formato de respuesta de las peticiones.
*/
class Response {

  /**
  * Crea una instancia del objeto Response.
  * @param {Object} [config={}] - Configuración del servidor.
  * @param {Boolean} [config.all200=false] - Indica si el código de respuesta de todas las peticiones será 200 (OK).
  */
  constructor(config = {}) {
    /**
    * Indica si el código de respuesta de todas las peticiones será 200 (OK).
    * @type {Boolean}
    */
    this.all200 = (typeof config.all200 != 'undefined') ? config.all200 : false
  }

  /**
  * La petición se ha completado con éxito.
  * @param {Object} [data] Objeto que se incluirá en la respuesta. Por defecto devuelve el mensaje 'Tarea completada exitosamente'.
  */
  success200(data = {msg:'Tarea completada exitosamente'}) {
    let code = (this.all200) ? 200 : 200
    this.status(code).json(this.formatSuccessJSON(200, data))
  }

  /**
  * La petición se ha completado con éxito y como resultado se ha creado un nuevo registro.
  * @param {Object} [data] Objeto que se incluirá en la respuesta. Por defecto devuelve el mensaje 'Registro creado exitosamente'.
  */
  success201(data = {msg:'Registro creado exitosamente'}) {
    let code = (this.all200) ? 200 : 201
    this.status(code).json(this.formatSuccessJSON(201, data))
  }

  /**
  * La petición no ha podido ser completada. Requiere autenticación.
  * @param {Object} [msg] Mensaje que se incluirá en la respuesta. Por defecto devuelve el mensaje 'Acceso no autorizado'.
  */
  error401(msg = 'Acceso no autorizado') {
    let code = (this.all200) ? 200 : 401
    this.status(code).json(this.formatErrorJSON(401, 'AUTHENTICATION_ERROR', msg))
  }

  /**
  * La petición no ha podido ser completada. No tiene los privilegios suficientes.
  * @param {Object} [msg] Mensaje que se incluirá en la respuesta. Por defecto devuelve el mensaje 'Acceso denegado'.
  */
  error403(msg = 'Acceso denegado') {
    let code = (this.all200) ? 200 : 403
    this.status(code).json(this.formatErrorJSON(403, 'ACCESS_ERROR', msg))
  }

  /**
  * La petición no ha podido ser completada. El recurso al que intenta acceder no existe.
  * @param {Object} [msg] Mensaje que se incluirá en la respuesta. Por defecto devuelve el mensaje 'No existe el recurso'.
  */
  error404(msg = 'No existe el recurso') {
    let code = (this.all200) ? 200 : 404
    this.status(code).json(this.formatErrorJSON(404, 'NOT_FOUND', msg))
  }

  /**
  * La petición no ha podido ser completada. Algunos datos no son válidos.
  * @param {Object} [msg] Mensaje que se incluirá en la respuesta. Por defecto devuelve el mensaje 'Algunos datos no son válidos'.
  */
  error422(msg = 'Algunos datos son inválidos') {
    let code = (this.all200) ? 200 : 422
    this.status(code).json(this.formatErrorJSON(422, 'VALIDATION_ERROR', msg))
  }

  /**
  * La petición no ha podido ser completada. Error interno del servidor.
  * @param {Object} [err] Objeto que se incluirá en la respuesta. Por defecto devuelve el mensaje 'Error del servidor'.
  */
  error500(err = 'Error del servidor') {
    let code = (this.all200) ? 200 : 500
    this.status(code).json(this.formatErrorJSON(500, 'SERVER_ERROR', err))
  }

  /**
  * La petición no ha podido ser completada. Existe algun tipo de error.
  * @param {SequelizeError|ResponseError} [err] Datos del error. Si el error no es reconocido, devolverá error500 con los datos del error.
  */
  error(err) {
    // Maneja todos los errores de instancia Error
    if (err instanceof ResponseError) {
      if (err.code == 401) { return this.error401(this.msg) }
      if (err.code == 403) { return this.error403(this.msg) }
      if (err.code == 404) { return this.error404(this.msg) }
      if (err.code == 422) { return this.error422(this.msg) }
      return this.error500(err)
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
    return this.error500(err)
  }

  /**
  * Formato JSON de una respuesta exitosa.
  * @param {Number} [code] Código de respuesta (Ej.: 200, 401, etc).
  * @param {Object} [data] Datos a incluir en la respuesta.
  * @return {Object}
  */
  formatSuccessJSON(code, data) {
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
  formatErrorJSON(code, type, msg) {
    return {
      status: 'FAIL',
      code: code,
      type: type,
      msg: msg
    }
  }

  /**
  * Incorpora los formatos de respuesta en una instancia de express.
  * @param {ExpressResponse} response Atributo response se una instancia del servidor express
  */
  assignTo(response) {
    response.all200 = this.all200
    response.formatSuccessJSON = this.formatSuccessJSON
    response.formatErrorJSON = this.formatErrorJSON
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
