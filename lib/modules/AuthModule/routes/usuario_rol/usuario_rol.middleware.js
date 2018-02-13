const { errors } = require('insac-response')

module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.listar = async (req) => {}

  MIDDLEWARE.obtener = async (req) => {
    const ID_USUARIO_ROL = req.params.id
    if (!await app.DAO.usuario_rol.buscar({id_usuario_rol: ID_USUARIO_ROL})) {
      throw new errors.PreconditionFailedError(`No se encuentra el registro usuario_rol solicitado.`)
    }
  }

  MIDDLEWARE.crear = async (req) => {
    const FID_USUARIO = req.body.fid_usuario
    const FID_ROL = req.body.fid_rol
    if (await app.DAO.usuario_rol.buscar({ fid_usuario: FID_USUARIO, fid_rol: FID_ROL })) {
      throw new errors.PreconditionFailedError(`El usuario y el rol ya se encuentran registrados.`)
    }
  }

  MIDDLEWARE.actualizar = async (req) => {
    const FID_USUARIO = req.body.fid_usuario
    const FID_ROL = req.body.fid_rol
    const ID_USUARIO_ROL = req.params.id
    if (!await app.DAO.usuario_rol.buscar({ id_usuario_rol: ID_USUARIO_ROL })) {
      throw new errors.PreconditionFailedError(`No se encuentra el registro usuario_rol que desea actualizar.`)
    }
    if (await app.DAO.usuario_rol.buscar({ fid_usuario: FID_USUARIO, fid_rol: FID_ROL }, { id_usuario_rol: ID_USUARIO_ROL })) {
      throw new errors.PreconditionFailedError(`El usuario y el rol ya se encuentran registrados.`)
    }
  }

  MIDDLEWARE.eliminar = async (req) => {
    const ID_USUARIO_ROL = req.params.id
    if (!await app.DAO.usuario_rol.buscar({ id_usuario_rol: ID_USUARIO_ROL })) {
      throw new errors.PreconditionFailedError(`No se encuentra el registro usuario_rol que desea eliminar.`)
    }
  }

  return MIDDLEWARE
}
