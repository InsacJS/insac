const _ = require('lodash')

const { util } = require('insac')

module.exports = (app) => {
  const CONTROLLER = {}

  CONTROLLER.get = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      const RESULTADO = await app.API.dao.persona._findAndCountAll(null, OPTIONS)
      return res.success200(RESULTADO.rows, 'Los registros han sido obtenidos con éxito.', util.metadata(req, RESULTADO))
    } catch (err) { return next(err) }
  }

  CONTROLLER.getId = async (req, res, next) => {
    try {
      const OPTIONS = req.options
      const ID_PERSONA = req.params.id_persona
      OPTIONS.where = { id_persona: ID_PERSONA }
      const RESULTADO = await app.API.dao.persona._findOne(null, OPTIONS)
      return res.success200(RESULTADO, 'El registro ha sido obtenido con éxito.')
    } catch (err) { return next(err) }
  }

  CONTROLLER.create = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const PERSONA = req.body
      const RESULTADO = await app.DB.sequelize.transaction(async (t) => {
        PERSONA._usuario_creacion = ID_USUARIO_SESION
        return app.API.dao.persona.create(t, PERSONA)
      })
      return res.success201(RESULTADO, 'El registro ha sido creado con éxito.')
    } catch (err) { return next(err) }
  }

  CONTROLLER.update = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ID_PERSONA = req.params.id_persona
      const FIELDS = ['nombre', 'telefono', 'email']
      const PERSONA = _.pick(req.body, FIELDS)
      await app.DB.sequelize.transaction(async (t) => {
        PERSONA._usuario_modificacion = ID_USUARIO_SESION
        await app.API.dao.persona.update(t, PERSONA, { id_persona: ID_PERSONA })
      })
      return res.success204()
    } catch (err) { return next(err) }
  }

  CONTROLLER.destroy = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ID_PERSONA = req.params.id_persona
      await app.DB.sequelize.transaction(async (t) => {
        const PERSONA = {}
        PERSONA._estado = 'ELIMINADO'
        PERSONA._usuario_eliminacion = ID_USUARIO_SESION
        await app.API.dao.persona.destroy(t, PERSONA,  { id_persona: ID_PERSONA })
      })
      return res.success204()
    } catch (err) { return next(err) }
  }

  CONTROLLER.restore = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ID_PERSONA = req.params.id_persona
      await app.DB.sequelize.transaction(async (t) => {
        const PERSONA = {}
        PERSONA._estado = 'ACTIVO'
        PERSONA._usuario_modificacion = ID_USUARIO_SESION
        PERSONA._usuario_eliminacion  = null
        await app.API.dao.persona.restore(t, PERSONA, { id_persona: ID_PERSONA })
      })
      return res.success204()
    } catch (err) { return next(err) }
  }

  // <!-- [CLI] - [COMPONENT] --!> //

  return CONTROLLER
}
