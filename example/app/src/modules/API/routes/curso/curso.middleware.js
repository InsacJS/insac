module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.listar = []

  MIDDLEWARE.obtener = [
    async (req, res) => {
      const ID_CURSO = req.params.id_curso
      if (!await app.DAO.curso.buscar({ id_curso: ID_CURSO })) {
        return res.error412(`No se encuentra el registro del curso solicitado.`)
      }
    }
  ]

  MIDDLEWARE.crear = [
    async (req, res) => {
      const NOMBRE = req.body.nombre
      if (await app.DAO.curso.buscar({ nombre: NOMBRE })) {
        return res.error412(`El nombre del curso ya se encuentra registrado.`)
      }
    }
  ]

  MIDDLEWARE.actualizar = [
    async (req, res) => {
      const NOMBRE = req.body.nombre
      const CATEGORIA = req.body.categoria
      const ID_CURSO = req.params.id_curso
      if (!await app.DAO.curso.buscar({ id_curso: ID_CURSO })) {
        return res.error412(`No se encuentra el registro del curso que desea actualizar.`)
      }
      if (!NOMBRE && !CATEGORIA) {
        return res.error412(`Debe enviar al menos un dato válido, para actualizar el registro del curso.`)
      }
      if (NOMBRE && await app.DAO.curso.buscar({ nombre: NOMBRE }, { id_curso: ID_CURSO })) {
        return res.error412(`El nombre del curso ya se encuentra registrado.`)
      }
    }
  ]

  MIDDLEWARE.eliminar = [
    async (req, res) => {
      const ID_CURSO = req.params.id_curso
      if (!await app.DAO.curso.buscar({ id_curso: ID_CURSO })) {
        return res.error412(`No se encuentra el registro del curso que desea eliminar.`)
      }
    }
  ]

  return MIDDLEWARE
}
