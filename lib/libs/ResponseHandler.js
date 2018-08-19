/** @ignore */ const OkSuccess               = require('./successes/OkSuccess')
/** @ignore */ const CreatedSuccess          = require('./successes/CreatedSuccess')
/** @ignore */ const NoContentSuccess        = require('./successes/NoContentSuccess')
/** @ignore */ const BadRequestError         = require('./errors/BadRequestError')
/** @ignore */ const UnauthorizedError       = require('./errors/UnauthorizedError')
/** @ignore */ const ForbiddenError          = require('./errors/ForbiddenError')
/** @ignore */ const NotFoundError           = require('./errors/NotFoundError')
/** @ignore */ const ConflictError           = require('./errors/ConflictError')
/** @ignore */ const PreconditionFailedError = require('./errors/PreconditionFailedError')
/** @ignore */ const InvalidTokenError       = require('./errors/InvalidTokenError')
/** @ignore */ const InternalServerError     = require('./errors/InternalServerError')

/**
* Clase Response
*/
class ResponseHandler {
  /**
  * Devuelve un middleware para enviar respuestas exitosas.
  * @param {Object}   [options]                - Opciones para configurar el formato.
  * @param {Function} [options.successHandler] - Función que se ejecuta cuando se activa el método success.
  *                                              En este punto se puede manipular las respuestas.
  * @param {Function} [options.onSuccess]      - Función que se ejecuta despues de normalizarla y
  *                                              antes de aplicar el formato. En este punto podemos ver
  *                                              el contenido original de la respuesta.
  * @param {Function} [options.successFormat]  - Función que se ejecuta antes de enviar la respuesta.
  *                                              Devuelve la respuesta final.
  * @param {Boolean}  [options.all200=false]   - Indica si todas las peticiones tendrán como resultado `status: 200 Ok`
  * @return {Function}
  */
  static success (options = {}) {
    const successHandler = options.successHandler || ((data) => data)
    const onSuccess      = options.onSuccess      || (() => {})
    const successFormat  = options.successFormat  || (result => result)
    const all200         = (typeof options.all200 !== 'undefined') ? options.all200 : false
    return (req, res, next) => {
      res.success = (data) => {
        const result = normalizeSuccess(successHandler(data))
        onSuccess(result, req)
        res.status(all200 ? 200 : result.code).send(successFormat(result))
      }
      res.success200 = (...args) => { res.success(OkSuccess.create(...args)) }
      res.success201 = (...args) => { res.success(CreatedSuccess.create(...args)) }
      res.success204 = (...args) => { res.success(NoContentSuccess.create(...args)) }
      next()
    }
  }

  /**
  * Devuelve un middleware para enviar respuestas con error.
  * @param {Object}   [options]              - Opciones para configurar el formato.
  * @param {Function} [options.errorHandler] - Función que se ejecuta cuando se activa el método error.
  *                                            En este punto se puede manipular las respuestas.
  * @param {Function} [options.onSuccess]    - Función que se ejecuta despues de normalizarla y
  *                                            antes de aplicar el formato. En este punto podemos ver
  *                                            el contenido original de la respuesta.
  * @param {Function} [options.errorFormat]  - Función que se ejecuta antes de enviar la respuesta.
  *                                            Devuelve la respuesta final.
  * @param {Boolean} [options.all200=false]  - Indica si todas las peticiones tendrán como resultado `status: 200 Ok`
  * @return {Function}
  */
  static error (options = {}) {
    const errorHandler = options.errorHandler || ((data) => data)
    const onError      = options.onError      || ((result) => result)
    const errorFormat  = options.errorFormat  || (result => {
      return {
        name    : result.name,
        status  : result.status,
        type    : result.type,
        code    : result.code,
        message : result.message,
        errors  : result.errors,
        parent  : result.parent
      }
    })
    const all200 = (typeof options.all200 !== 'undefined') ? options.all200 : false
    return (req, res, next) => {
      res.error = (data) => {
        const result = normalizeError(errorHandler(data))
        onError(result, req)
        res.status(all200 ? 200 : result.code).send(errorFormat(result))
      }
      res.error400 = (...args) => { res.error(BadRequestError.create(...args)) }
      res.error401 = (...args) => { res.error(UnauthorizedError.create(...args)) }
      res.error403 = (...args) => { res.error(ForbiddenError.create(...args)) }
      res.error404 = (...args) => { res.error(NotFoundError.create(...args)) }
      res.error409 = (...args) => { res.error(ConflictError.create(...args)) }
      res.error412 = (...args) => { res.error(PreconditionFailedError.create(...args)) }
      res.error498 = (...args) => { res.error(InvalidTokenError.create(...args)) }
      res.error500 = (...args) => { res.error(InternalServerError.create(...args)) }
      next()
    }
  }
}

/**
* @ignore
* Normaliza el resultado. Si no es instancia de la clase ResponseSuccess,
* por defecto se crea un resultado de tipo OkSuccess.
* @param {Object} data - Resultado.
* @return {ResponseSuccess}
*/
function normalizeSuccess (data) {
  if (data && data.name && data.name === 'ResponseHandlerSuccess') { return data }
  return OkSuccess.create(data)
}

/**
* @ignore
* Normaliza el resultado. Si no es instancia de la clase ResponseError,
* por defecto se crea un resultado de tipo InternalServerError.
* @param {Object} err - Error.
* @return {ResponseError}
*/
function normalizeError (err) {
  if (err && err.name && err.name === 'ResponseHandlerError') { return err }
  return InternalServerError.create(err)
}

module.exports = ResponseHandler
