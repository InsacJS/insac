const { errors } = require('insac-response')

module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.listar = async (req) => {}

  MIDDLEWARE.obtener = async (req) => {
    const ID_ROL = req.params.id
    if (!await app.DAO.rol.buscar({id_rol: ID_ROL})) {
      throw new errors.PreconditionFailedError(`No se encuentra el registro del rol solicitado.`)
    }
  }

  MIDDLEWARE.crear = async (req) => {
    const NOMBRE = req.body.nombre
    if (await app.DAO.rol.buscar({ nombre: NOMBRE })) {
      throw new errors.PreconditionFailedError(`El código de rol ya se encuentra registrado.`)
    }
  }

  MIDDLEWARE.actualizar = async (req) => {
    const NOMBRE = req.body.nombre
    const DESCRIPCION = req.body.descripcion
    const ID_ROL = req.params.id
    if (!await app.DAO.rol.buscar({ id_rol: ID_ROL })) {
      throw new errors.PreconditionFailedError(`No se encuentra el registro del rol que desea actualizar.`)
    }
    if (!NOMBRE && !DESCRIPCION) {
      throw new errors.PreconditionFailedError(`Debe enviar al menos un dato válido, para actualizar el registro del rol.`)
    }
    if (NOMBRE && await app.DAO.rol.buscar({ nombre: NOMBRE }, { id_rol: ID_ROL })) {
      throw new errors.PreconditionFailedError(`El descripcion de rol ya se encuentra registrado.`)
    }
  }

  MIDDLEWARE.eliminar = async (req) => {
    const ID_ROL = req.params.id
    if (!await app.DAO.rol.buscar({ id_rol: ID_ROL })) {
      throw new errors.PreconditionFailedError(`No se encuentra el registro del rol que desea eliminar.`)
    }
  }

  return MIDDLEWARE
}
