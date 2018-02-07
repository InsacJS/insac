const { errors } = require(global.INSAC)

module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.listar = async (req) => {
    await app.AUTH.access('admin', req)
  }

  MIDDLEWARE.obtener = async (req) => {
    const ID_CURSO = req.params.id
    if (!await app.DAO.curso.buscar({ id_curso: ID_CURSO })) {
      throw new errors.PreconditionError(`No se encuentra el registro del curso solicitado.`)
    }
  }

  MIDDLEWARE.crear = async (req) => {
    const NOMBRE = req.body.nombre
    if (await app.DAO.curso.buscar({ nombre: NOMBRE })) {
      throw new errors.PreconditionError(`El nombre del curso ya se encuentra registrado.`)
    }
  }

  MIDDLEWARE.actualizar = async (req) => {
    const NOMBRE = req.body.nombre
    const CATEGORIA = req.body.categoria
    const ID_CURSO = req.params.id
    if (!await app.DAO.curso.buscar({ id_curso: ID_CURSO })) {
      throw new errors.PreconditionError(`No se encuentra el registro del curso que desea actualizar.`)
    }
    if (!NOMBRE && !CATEGORIA) {
      throw new errors.PreconditionError(`Debe enviar al menos un dato válido, para actualizar el registro del curso.`)
    }
    if (NOMBRE && await app.DAO.curso.buscar({ nombre: NOMBRE }, { id_curso: ID_CURSO })) {
      throw new errors.PreconditionError(`El nombre del curso ya se encuentra registrado.`)
    }
  }

  MIDDLEWARE.eliminar = async (req) => {
    const ID_CURSO = req.params.id
    if (!await app.DAO.curso.buscar({ id_curso: ID_CURSO })) {
      throw new errors.PreconditionError(`No se encuentra el registro del curso que desea eliminar.`)
    }
  }

  return MIDDLEWARE
}
