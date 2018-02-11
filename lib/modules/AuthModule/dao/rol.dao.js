module.exports = (app) => {
  const OP = app.DB.Sequelize.Op
  const MODELS = app.DB.models

  const DAO = {}

  DAO.listar = async (options) => {
    return MODELS.rol.findAndCountAll(options)
  }

  DAO.obtener = async (options) => {
    return MODELS.rol.findOne(options)
  }

  DAO.buscar = async (where, not) => {
    const options = { where }
    if (not) {
      options.where[OP.not] = not
    }
    return MODELS.rol.findOne(options)
  }

  DAO.crear = async (rol) => {
    return MODELS.rol.create(rol)
  }

  DAO.actualizar = async (rol, idRol) => {
    return MODELS.rol.update(rol, {
      where: {
        id_rol: idRol
      }
    })
  }

  DAO.eliminar = async (idRol) => {
    return MODELS.rol.destroy({
      where: {
        id_rol: idRol
      }
    })
  }

  return DAO
}
