const _ = require('lodash')

const { util } = require('insac')

module.exports = (app) => {
  const CONTROLLER = {}

  CONTROLLER.get = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      const RESULTADO = await app.API.dao.post._findAndCountAll(null, OPTIONS)
      return res.success200(RESULTADO.rows, 'Los registros han sido obtenidos con éxito.', util.metadata(req, RESULTADO))
    } catch (err) { return next(err) }
  }

  CONTROLLER.getId = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      const ID_POST = req.params.id_post
      OPTIONS.where = { id_post: ID_POST }
      const RESULTADO = await app.API.dao.post._findOne(null, OPTIONS)
      return res.success200(RESULTADO, 'El registro ha sido obtenido con éxito.')
    } catch (err) { return next(err) }
  }

  CONTROLLER.create = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const POST = req.body
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        POST._usuario_creacion = ID_USUARIO_SESION
        return app.API.dao.post.create(t, POST)
      })
      return res.success201(RESULTADO, 'El registro ha sido creado con éxito.')
    } catch (err) { return next(err) }
  }

  CONTROLLER.update = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ID_POST = req.params.id_post
      const FIELDS = ['titulo', 'fecha', 'descripcion', 'fid_autor']
      const POST = _.pick(req.body, FIELDS)
      await app.DB.sequelize.transaction(async (t) => {
        POST._usuario_modificacion = ID_USUARIO_SESION
        await app.API.dao.post.update(t, POST, { id_post: ID_POST })
      })
      return res.success204()
    } catch (err) { return next(err) }
  }

  CONTROLLER.destroy = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ID_POST = req.params.id_post
      await app.DB.sequelize.transaction(async (t) => {
        const POST = {}
        POST._estado = 'ELIMINADO'
        POST._usuario_eliminacion = ID_USUARIO_SESION
        await app.API.dao.post.destroy(t, POST,  { id_post: ID_POST })
      })
      return res.success204()
    } catch (err) { return next(err) }
  }

  CONTROLLER.restore = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ID_POST = req.params.id_post
      await app.DB.sequelize.transaction(async (t) => {
        const POST = {}
        POST._estado = 'ACTIVO'
        POST._usuario_modificacion = ID_USUARIO_SESION
        POST._usuario_eliminacion  = null
        await app.API.dao.post.restore(t, POST, { id_post: ID_POST })
      })
      return res.success204()
    } catch (err) { return next(err) }
  }

  // <!-- [CLI] - [COMPONENT] --!> //

  return CONTROLLER
}
