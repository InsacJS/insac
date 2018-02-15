module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.listar = [
    async (req, res) => {}
  ]

  MIDDLEWARE.obtener = [
    async (req, res) => {
      const ID_USUARIO_ROL = req.params.id_usuario_rol
      if (!await app.DAO.usuario_rol.buscar({id_usuario_rol: ID_USUARIO_ROL})) {
        return res.error412(`No se encuentra el registro usuario_rol solicitado.`)
      }
    }
  ]

  MIDDLEWARE.crear = [
    async (req, res) => {
      const FID_USUARIO = req.body.fid_usuario
      const FID_ROL = req.body.fid_rol
      if (await app.DAO.usuario_rol.buscar({ fid_usuario: FID_USUARIO, fid_rol: FID_ROL })) {
        return res.error412(`El usuario y el rol ya se encuentran registrados.`)
      }
    }
  ]

  MIDDLEWARE.actualizar = [
    async (req, res) => {
      const FID_USUARIO = req.body.fid_usuario
      const FID_ROL = req.body.fid_rol
      const ID_USUARIO_ROL = req.params.id_usuario_rol
      if (!await app.DAO.usuario_rol.buscar({ id_usuario_rol: ID_USUARIO_ROL })) {
        return res.error412(`No se encuentra el registro usuario_rol que desea actualizar.`)
      }
      if (await app.DAO.usuario_rol.buscar({ fid_usuario: FID_USUARIO, fid_rol: FID_ROL }, { id_usuario_rol: ID_USUARIO_ROL })) {
        return res.error412(`El usuario y el rol ya se encuentran registrados.`)
      }
    }
  ]

  MIDDLEWARE.eliminar = [
    async (req, res) => {
      const ID_USUARIO_ROL = req.params.id_usuario_rol
      if (!await app.DAO.usuario_rol.buscar({ id_usuario_rol: ID_USUARIO_ROL })) {
        return res.error412(`No se encuentra el registro usuario_rol que desea eliminar.`)
      }
    }
  ]

  return MIDDLEWARE
}
