module.exports = (app) => {
  const CONTROLLER = {}

  CONTROLLER.listar = async (req, success) => {
    const OPTIONS = req.options
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.rol.listar(OPTIONS)
    })
    success(RESULT.rows, 'La lista de roles ha sido obtenida con éxito.', RESULT.count)
  }

  CONTROLLER.obtener = async (req, success) => {
    const OPTIONS = req.options
    OPTIONS.where = { id_rol: req.params.id_rol }
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.rol.obtener(OPTIONS)
    })
    success(RESULT, 'La información del rol ha sido obtenida con éxito.')
  }

  CONTROLLER.crear = async (req, success) => {
    const RESULT = await app.DB.sequelize.transaction(async () => {
      const ROL = req.body
      return app.DAO.rol.crear(ROL)
    })
    success(RESULT, 'El rol ha sido creado con éxito.')
  }

  CONTROLLER.actualizar = async (req, success) => {
    const ROL = req.body
    const ID_ROL = req.params.id_rol
    const RESULT = await app.DB.sequelize.transaction(async () => {
      await app.DAO.rol.actualizar(ROL, ID_ROL)
    })
    success(RESULT, 'Los datos del rol han sido actualizados con éxito.')
  }

  CONTROLLER.eliminar = async (req, success) => {
    const ID_ROL = req.params.id_rol
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.rol.eliminar(ID_ROL)
    })
    success(RESULT, 'Los datos del rol han sido eliminados con éxito.')
  }

  return CONTROLLER
}
