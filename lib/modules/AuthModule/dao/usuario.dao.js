module.exports = (app) => {
  const OP = app.DB.Sequelize.Op
  const MODELS = app.DB.models

  const DAO = {}

  DAO.listar = async (options) => {
    return MODELS.usuario.findAndCountAll(options)
  }

  DAO.obtener = async (options) => {
    return MODELS.usuario.findOne(options)
  }

  DAO.buscar = async (where, not) => {
    const options = { where }
    if (not) {
      options.where[OP.not] = not
    }
    return MODELS.usuario.findOne(options)
  }

  DAO.crear = async (usuario) => {
    return MODELS.usuario.create(usuario)
  }

  DAO.actualizar = async (usuario, idUsuario) => {
    return MODELS.usuario.update(usuario, {
      where: {
        id_usuario: idUsuario
      }
    })
  }

  DAO.eliminar = async (idUsuario) => {
    return MODELS.usuario.destroy({
      where: {
        id_usuario: idUsuario
      }
    })
  }

  return DAO
}
