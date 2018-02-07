module.exports = (app) => {
  const MODELS = app.DB.models
  const DAO = {}

  DAO.listar = async (options) => {
    return MODELS.curso.findAndCountAll(options)
  }

  DAO.obtener = async (options) => {
    return MODELS.curso.findOne(options)
  }

  DAO.buscar = async (where, not) => {
    const options = { where }
    if (not) { options.where[app.DB.Sequelize.Op.not] = not }
    return MODELS.curso.findOne(options)
  }

  DAO.crear = async (curso) => {
    return MODELS.curso.create(curso)
  }

  DAO.actualizar = async (curso, idCurso) => {
    return MODELS.curso.update(curso, { where: { id_curso: idCurso } })
  }

  DAO.eliminar = async (idCurso) => {
    return MODELS.curso.destroy({ where: { id_curso: idCurso } })
  }

  return DAO
}
