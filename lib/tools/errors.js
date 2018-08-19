module.exports = {
  BadRequest         : require('../libs/errors/BadRequestError'),
  Unauthorized       : require('../libs/errors/UnauthorizedError'),
  Forbidden          : require('../libs/errors/ForbiddenError'),
  NotFound           : require('../libs/errors/NotFoundError'),
  Conflict           : require('../libs/errors/ConflictError'),
  PreconditionFailed : require('../libs/errors/PreconditionFailedError'),
  InvalidToken       : require('../libs/errors/InvalidTokenError'),
  InternalServer     : require('../libs/errors/InternalServerError')
}
