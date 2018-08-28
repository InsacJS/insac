
/**
* Objeto para instanciar objetos de tipo 'error'
* @type {Object}
* @property {BadRequestError}         BadRequest              - Clase BadRequestError
* @property {UnauthorizedError}       Unauthorized            - Clase UnauthorizedError
* @property {ForbiddenError}          Forbidden               - Clase ForbiddenError
* @property {NotFoundError}           NotFoundError           - Clase NotFoundError
* @property {ConflictError}           ConflictError           - Clase ConflictError
* @property {PreconditionFailedError} PreconditionFailedError - Clase PreconditionFailedError
* @property {InvalidTokenError}       InvalidTokenError       - Clase InvalidTokenError
* @property {InternalServerError}     InternalServerError     - Clase InternalServerError
*/
const errors = {
  BadRequest         : require('../libs/errors/BadRequestError'),
  Unauthorized       : require('../libs/errors/UnauthorizedError'),
  Forbidden          : require('../libs/errors/ForbiddenError'),
  NotFound           : require('../libs/errors/NotFoundError'),
  Conflict           : require('../libs/errors/ConflictError'),
  PreconditionFailed : require('../libs/errors/PreconditionFailedError'),
  InvalidToken       : require('../libs/errors/InvalidTokenError'),
  InternalServer     : require('../libs/errors/InternalServerError')
}

module.exports = errors
