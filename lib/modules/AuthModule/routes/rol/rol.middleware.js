module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.listar = [
    async (req, res) => {}
  ]

  MIDDLEWARE.obtener = [
    async (req, res) => {
      const ID_ROL = req.params.id_rol
      if (!await app.DAO.rol.buscar({id_rol: ID_ROL})) {
        return res.error412(`No se encuentra el registro del rol solicitado.`)
      }
    }
  ]

  MIDDLEWARE.crear = [
    async (req, res) => {
      const NOMBRE = req.body.nombre
      if (await app.DAO.rol.buscar({ nombre: NOMBRE })) {
        return res.error412(`El código de rol ya se encuentra registrado.`)
      }
    }
  ]

  MIDDLEWARE.actualizar = [
    async (req, res) => {
      const NOMBRE = req.body.nombre
      const DESCRIPCION = req.body.descripcion
      const ID_ROL = req.params.id_rol
      if (!await app.DAO.rol.buscar({ id_rol: ID_ROL })) {
        return res.error412(`No se encuentra el registro del rol que desea actualizar.`)
      }
      if (!NOMBRE && !DESCRIPCION) {
        return res.error412(`Debe enviar al menos un dato válido, para actualizar el registro del rol.`)
      }
      if (NOMBRE && await app.DAO.rol.buscar({ nombre: NOMBRE }, { id_rol: ID_ROL })) {
        return res.error412(`El descripcion de rol ya se encuentra registrado.`)
      }
    }
  ]

  MIDDLEWARE.eliminar = [
    async (req, res) => {
      const ID_ROL = req.params.id_rol
      if (!await app.DAO.rol.buscar({ id_rol: ID_ROL })) {
        return res.error412(`No se encuentra el registro del rol que desea eliminar.`)
      }
    }
  ]

  return MIDDLEWARE
}
