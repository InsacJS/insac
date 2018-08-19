const _                        = require('lodash')
const { errors }               = require(global.INSAC)
const { NotFound, BadRequest } = errors

module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.get = []

  MIDDLEWARE.getId = [
    async (req, res, next) => {
      try {
        const ID = req.params.id
        if (!await app.API.dao.libro.findOne(null, { id: ID })) {
          throw new NotFound('No se encuentra el registro solicitado.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  MIDDLEWARE.create = []

  MIDDLEWARE.update = [
    async (req, res, next) => {
      try {
        const ID = req.params.id
        const FIELDS = ['titulo', 'nro_paginas', 'precio', 'resumen', 'fid_autor']
        const LIBRO = _.pick(req.body, FIELDS)
        if (!await app.API.dao.libro.findOne(null, { id: ID })) {
          throw new NotFound('No se encuentra el registro que desea actualizar.')
        }
        if (Object.keys(LIBRO).length === 0) {
          throw new BadRequest('Debe enviar al menos un dato válido, para actualizar el registro.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  MIDDLEWARE.destroy = [
    async (req, res, next) => {
      try {
        const ID = req.params.id
        if (!await app.API.dao.libro.findOne(null, { id: ID })) {
          throw new NotFound('No se encuentra el registro que desea eliminar.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  MIDDLEWARE.restore = [
    async (req, res, next) => {
      try {
        const ID = req.params.id
        if (!await app.API.dao.libro.findOne(null, { id: ID }, null, null, false)) {
          throw new NotFound('No se encuentra el registro que desea restaurar.')
        }
        return next()
      } catch (err) { return next(err) }
    }
  ]

  // <!-- [CLI] - [COMPONENT] --!> //

  return MIDDLEWARE
}
