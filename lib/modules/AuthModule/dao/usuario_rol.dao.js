module.exports = (app) => {
  const OP = app.DB.Sequelize.Op
  const MODELS = app.DB.models

  const DAO = {}

  DAO.listar = async (options) => {
    return MODELS.usuario_rol.findAndCountAll(options)
  }

  DAO.obtener = async (options) => {
    return MODELS.usuario_rol.findOne(options)
  }

  DAO.buscar = async (where, not) => {
    const options = { where }
    if (not) {
      options.where[OP.not] = not
    }
    return MODELS.usuario_rol.findOne(options)
  }

  DAO.crear = async (usuarioRol) => {
    return MODELS.usuario_rol.create(usuarioRol)
  }

  DAO.actualizar = async (usuarioRol, idUsuarioRol) => {
    return MODELS.usuario_rol.update(usuarioRol, {
      where: {
        id_usuario_rol: idUsuarioRol
      }
    })
  }

  DAO.eliminar = async (idUsuarioRol) => {
    return MODELS.usuario_rol.destroy({
      where: {
        id_usuario_rol: idUsuarioRol
      }
    })
  }

  return DAO
}
