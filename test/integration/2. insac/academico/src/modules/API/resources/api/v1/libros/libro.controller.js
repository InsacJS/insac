const _ = require('lodash')

const { util } = require(global.INSAC)

module.exports = (app) => {
  const CONTROLLER = {}

  CONTROLLER.get = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      const RESULTADO = await app.API.dao.libro._findAndCountAll(null, OPTIONS)
      return res.success200(RESULTADO.rows, 'La lista de registros ha sido obtenida con éxito.', util.metadata(req, RESULTADO))
    } catch (err) { return next(err) }
  }

  CONTROLLER.getId = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      const ID = req.params.id
      OPTIONS.where = { id: ID }
      const RESULTADO = await app.API.dao.libro._findOne(null, OPTIONS)
      return res.success200(RESULTADO, 'La información del registro ha sido obtenida con éxito.')
    } catch (err) { return next(err) }
  }

  CONTROLLER.create = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const LIBRO = req.body
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        LIBRO._usuario_creacion = ID_USUARIO_SESION
        return app.API.dao.libro.create(t, LIBRO)
      })
      return res.success201(RESULTADO, 'El registro ha sido creado con éxito.')
    } catch (err) { return next(err) }
  }

  CONTROLLER.update = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ID = req.params.id
      const FIELDS = ['titulo', 'nro_paginas', 'precio', 'resumen', 'fid_autor']
      const LIBRO = _.pick(req.body, FIELDS)
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        LIBRO._usuario_modificacion = ID_USUARIO_SESION
        await app.API.dao.libro.update(t, LIBRO, { id: ID })
      })
      return res.success200(RESULTADO, 'El registro ha sido actualizado con éxito.')
    } catch (err) { return next(err) }
  }

  CONTROLLER.destroy = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ID = req.params.id
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        const LIBRO = {}
        LIBRO._estado = 'ELIMINADO'
        LIBRO._usuario_eliminacion = ID_USUARIO_SESION
        await app.API.dao.libro.destroy(t, LIBRO,  { id: ID })
      })
      return res.success200(RESULTADO, 'El registro ha sido eliminado con éxito.')
    } catch (err) { return next(err) }
  }

  CONTROLLER.restore = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ID = req.params.id
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        const LIBRO = {}
        LIBRO._estado = 'ACTIVO'
        LIBRO._usuario_modificacion = ID_USUARIO_SESION
        LIBRO._usuario_eliminacion  = null
        await app.API.dao.libro.restore(t, LIBRO, { id: ID })
      })
      return res.success200(RESULTADO, 'El registro ha sido restaurado con éxito.')
    } catch (err) { return next(err) }
  }

  // <!-- [CLI] - [COMPONENT] --!> //

  return CONTROLLER
}
