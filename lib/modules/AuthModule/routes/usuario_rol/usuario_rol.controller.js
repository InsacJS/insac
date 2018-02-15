module.exports = (app) => {
  const CONTROLLER = {}

  CONTROLLER.listar = async (req, res) => {
    const OPTIONS = req.options
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.usuario_rol.listar(OPTIONS)
    })
    return res.success200(RESULT.rows, 'La lista de registros usuario_rol ha sido obtenida con éxito.', RESULT.count)
  }

  CONTROLLER.obtener = async (req, res) => {
    const OPTIONS = req.options
    OPTIONS.where = { id_usuario_rol: req.params.id_usuario_rol }
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.usuario_rol.obtener(OPTIONS)
    })
    return res.success200(RESULT, 'La información del registro usuario_rol ha sido obtenida con éxito.')
  }

  CONTROLLER.crear = async (req, res) => {
    const RESULT = await app.DB.sequelize.transaction(async () => {
      const USUARIO_ROL = req.body
      return app.DAO.usuario_rol.crear(USUARIO_ROL)
    })
    return res.success201(RESULT, 'El registro usuario_rol ha sido creado con éxito.')
  }

  CONTROLLER.actualizar = async (req, res) => {
    const USUARIO_ROL = req.body
    const ID_USUARIO_ROL = req.params.id_usuario_rol
    const RESULT = await app.DB.sequelize.transaction(async () => {
      await app.DAO.usuario_rol.actualizar(USUARIO_ROL, ID_USUARIO_ROL)
    })
    return res.success200(RESULT, 'Los datos del registro usuario_rol han sido actualizados con éxito.')
  }

  CONTROLLER.eliminar = async (req, res) => {
    const ID_USUARIO_ROL = req.params.id_usuario_rol
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.usuario_rol.eliminar(ID_USUARIO_ROL)
    })
    return res.success200(RESULT, 'Los datos del registro usuario_rol han sido eliminados con éxito.')
  }

  return CONTROLLER
}
