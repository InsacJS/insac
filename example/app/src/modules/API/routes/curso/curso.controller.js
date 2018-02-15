module.exports = (app) => {
  const CONTROLLER = {}

  CONTROLLER.listar = async (req, res) => {
    const OPTIONS = req.options
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.curso.listar(OPTIONS)
    })
    return res.success200(RESULT.rows, 'La lista de cursos ha sido obtenida con éxito.', { count: RESULT.count })
  }

  CONTROLLER.obtener = async (req, res) => {
    const OPTIONS = req.options
    OPTIONS.where = { id_curso: req.params.id_curso }
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.curso.obtener(OPTIONS)
    })
    return res.success200(RESULT, 'La información del curso ha sido obtenida con éxito.')
  }

  CONTROLLER.crear = async (req, res) => {
    const CURSO = req.body
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.curso.crear(CURSO)
    })
    return res.success201(RESULT, 'El curso ha sido creado con éxito.')
  }

  CONTROLLER.actualizar = async (req, res) => {
    const CURSO = req.body
    const ID_CURSO = req.params.id_curso
    const RESULT = await app.DB.sequelize.transaction(async () => {
      await app.DAO.curso.actualizar(CURSO, ID_CURSO)
    })
    return res.success200(RESULT, 'Los datos del curso han sido actualizados con éxito.')
  }

  CONTROLLER.eliminar = async (req, res) => {
    const ID_CURSO = req.params.id_curso
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.curso.eliminar(ID_CURSO)
    })
    return res.success200(RESULT, 'Los datos del curso han sido eliminados con éxito.')
  }

  return CONTROLLER
}
