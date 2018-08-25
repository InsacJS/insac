module.exports = (app) => {
  const CONTROLLER = {}

  CONTROLLER.habilitar = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ID_USUARIO        = req.body.usuario.id
      await app.DB.sequelize.transaction(async (t) => {
        const USUARIO = {
          _estado               : 'ACTIVO',
          _usuario_modificacion : ID_USUARIO_SESION
        }
        await app.AUTH.dao.usuario.update(t, USUARIO, { id: ID_USUARIO })
      })
      return res.success204()
    } catch (err) { return next(err) }
  }

  CONTROLLER.deshabilitar = async (req, res, next) => {
    try {
      const ID_USUARIO_SESION = 1
      const ID_USUARIO        = req.body.usuario.id
      await app.DB.sequelize.transaction(async (t) => {
        const USUARIO = {
          _estado               : 'INACTIVO',
          _usuario_modificacion : ID_USUARIO_SESION
        }
        await app.AUTH.dao.usuario.update(t, USUARIO,  { id: ID_USUARIO })
      })
      return res.success204()
    } catch (err) { return next(err) }
  }

  return CONTROLLER
}
