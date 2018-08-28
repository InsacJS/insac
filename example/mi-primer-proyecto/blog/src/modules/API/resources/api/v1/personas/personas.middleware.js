const _ = require('lodash')

const { errors } = require('insac')
const { NotFound, BadRequest } = errors

module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.get = []

  MIDDLEWARE.getId = [
    async (req, res, next) => {
      try {
        const ID_PERSONA = req.params.id_persona
        if (!await app.API.dao.persona.findOne(null, { id_persona: ID_PERSONA })) {
          throw new NotFound('No existe el registro solicitado.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  MIDDLEWARE.create = []

  MIDDLEWARE.update = [
    async (req, res, next) => {
      try {
        const ID_PERSONA = req.params.id_persona
        const FIELDS = ['nombre', 'telefono', 'email']
        const PERSONA = _.pick(req.body, FIELDS)
        if (!await app.API.dao.persona.findOne(null, { id_persona: ID_PERSONA })) {
          throw new NotFound('No existe el registro que desea actualizar.')
        }
        if (Object.keys(PERSONA).length === 0) {
          throw new BadRequest('Debe enviar al menos un dato válido, para actualizar el registro.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  MIDDLEWARE.destroy = [
    async (req, res, next) => {
      try {
        const ID_PERSONA = req.params.id_persona
        if (!await app.API.dao.persona.findOne(null, { id_persona: ID_PERSONA })) {
          throw new NotFound('No existe el registro que desea eliminar.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  MIDDLEWARE.restore = [
    async (req, res, next) => {
      try {
        const ID_PERSONA = req.params.id_persona
        if (!await app.API.dao.persona.findOne(null, { id_persona: ID_PERSONA }, null, null, false)) {
          throw new NotFound('No existe el registro que desea restaurar.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  // <!-- [CLI] - [COMPONENT] --!> //

  return MIDDLEWARE
}
