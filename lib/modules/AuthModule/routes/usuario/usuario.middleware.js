module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.listar = [
    async (req, res) => {}
  ]

  MIDDLEWARE.obtener = [
    async (req, res) => {
      const ID_USUARIO = req.params.id_usuario
      if (!await app.DAO.usuario.buscar({id_usuario: ID_USUARIO})) {
        return res.error412(`No se encuentra el registro del usuario solicitado.`)
      }
    }
  ]

  MIDDLEWARE.crear = [
    async (req, res) => {
      const USERNAME = req.body.username
      if (await app.DAO.usuario.buscar({ username: USERNAME })) {
        return res.error412(`El nombre de usuario ya se encuentra registrado.`)
      }
    }
  ]

  MIDDLEWARE.actualizar = [
    async (req, res) => {
      const USERNAME = req.body.username
      const PASSWORD = req.body.password
      const ID_USUARIO = req.params.id_usuario
      if (!await app.DAO.usuario.buscar({ id_usuario: ID_USUARIO })) {
        return res.error412(`No se encuentra el registro del usuario que desea actualizar.`)
      }
      if (!USERNAME && !PASSWORD) {
        return res.error412(`Debe enviar al menos un dato válido, para actualizar el registro del usuario.`)
      }
      if (USERNAME && await app.DAO.usuario.buscar({ username: USERNAME }, { id_usuario: ID_USUARIO })) {
        return res.error412(`El nombre de usuario ya se encuentra registrado.`)
      }
    }
  ]

  MIDDLEWARE.eliminar = [
    async (req, res) => {
      const ID_USUARIO = req.params.id_usuario
      if (!await app.DAO.usuario.buscar({ id_usuario: ID_USUARIO })) {
        return res.error412(`No se encuentra el registro del usuario que desea eliminar.`)
      }
    }
  ]

  return MIDDLEWARE
}
