module.exports = (app) => {
  const CONTROLLER = {}

  CONTROLLER.listar = async (req, success) => {
    const OPTIONS = req.options
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.usuario_rol.listar(OPTIONS)
    })
    success(RESULT.rows, 'La lista de registros usuario_rol ha sido obtenida con éxito.', RESULT.count)
  }

  CONTROLLER.obtener = async (req, success) => {
    const OPTIONS = req.options
    OPTIONS.where = { id_usuario_rol: req.params.id }
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.usuario_rol.obtener(OPTIONS)
    })
    success(RESULT, 'La información del registro usuario_rol ha sido obtenida con éxito.')
  }

  CONTROLLER.crear = async (req, success) => {
    const RESULT = await app.DB.sequelize.transaction(async () => {
      const USUARIO_ROL = req.body
      return app.DAO.usuario_rol.crear(USUARIO_ROL)
    })
    success(RESULT, 'El registro usuario_rol ha sido creado con éxito.')
  }

  CONTROLLER.actualizar = async (req, success) => {
    const USUARIO_ROL = req.body
    const ID_USUARIO_ROL = req.params.id
    const RESULT = await app.DB.sequelize.transaction(async () => {
      await app.DAO.usuario_rol.actualizar(USUARIO_ROL, ID_USUARIO_ROL)
    })
    success(RESULT, 'Los datos del registro usuario_rol han sido actualizados con éxito.')
  }

  CONTROLLER.eliminar = async (req, success) => {
    const ID_USUARIO_ROL = req.params.id
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.usuario_rol.eliminar(ID_USUARIO_ROL)
    })
    success(RESULT, 'Los datos del registro usuario_rol han sido eliminados con éxito.')
  }

  return CONTROLLER
}
