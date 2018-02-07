module.exports = (app) => {
  const CONTROLLER = {}

  CONTROLLER.listar = async (req, success) => {
    const OPTIONS = req.options
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.curso.listar(OPTIONS)
    })
    success(RESULT.rows, 'La lista de cursos ha sido obtenida con éxito.', RESULT.count)
  }

  CONTROLLER.obtener = async (req, success) => {
    const OPTIONS = req.options
    OPTIONS.where = { id_curso: req.params.id }
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.curso.obtener(OPTIONS)
    })
    success(RESULT, 'La información del curso ha sido obtenida con éxito.')
  }

  CONTROLLER.crear = async (req, success) => {
    const CURSO = req.body
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.curso.crear(CURSO)
    })
    success(RESULT, 'El curso ha sido creado con éxito.')
  }

  CONTROLLER.actualizar = async (req, success) => {
    const CURSO = req.body
    const ID_CURSO = req.params.id
    const RESULT = await app.DB.sequelize.transaction(async () => {
      await app.DAO.curso.actualizar(CURSO, ID_CURSO)
    })
    success(RESULT, 'Los datos del curso han sido actualizados con éxito.')
  }

  CONTROLLER.eliminar = async (req, success) => {
    const ID_CURSO = req.params.id
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.curso.eliminar(ID_CURSO)
    })
    success(RESULT, 'Los datos del curso han sido eliminados con éxito.')
  }

  return CONTROLLER
}
