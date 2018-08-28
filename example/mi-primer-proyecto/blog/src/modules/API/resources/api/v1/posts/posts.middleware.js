const _ = require('lodash')

const { errors } = require('insac')
const { NotFound, BadRequest } = errors

module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.get = []

  MIDDLEWARE.getId = [
    async (req, res, next) => {
      try {
        const ID_POST = req.params.id_post
        if (!await app.API.dao.post.findOne(null, { id_post: ID_POST })) {
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
        const ID_POST = req.params.id_post
        const FIELDS = ['titulo', 'fecha', 'descripcion', 'fid_autor']
        const POST = _.pick(req.body, FIELDS)
        if (!await app.API.dao.post.findOne(null, { id_post: ID_POST })) {
          throw new NotFound('No existe el registro que desea actualizar.')
        }
        if (Object.keys(POST).length === 0) {
          throw new BadRequest('Debe enviar al menos un dato válido, para actualizar el registro.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  MIDDLEWARE.destroy = [
    async (req, res, next) => {
      try {
        const ID_POST = req.params.id_post
        if (!await app.API.dao.post.findOne(null, { id_post: ID_POST })) {
          throw new NotFound('No existe el registro que desea eliminar.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  MIDDLEWARE.restore = [
    async (req, res, next) => {
      try {
        const ID_POST = req.params.id_post
        if (!await app.API.dao.post.findOne(null, { id_post: ID_POST }, null, null, false)) {
          throw new NotFound('No existe el registro que desea restaurar.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  // <!-- [CLI] - [COMPONENT] --!> //

  return MIDDLEWARE
}
