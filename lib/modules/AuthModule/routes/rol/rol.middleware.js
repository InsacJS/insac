const { errors } = require('insac-response')

module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.listar = async (req) => {}

  MIDDLEWARE.obtener = async (req) => {
    const ID_ROL = req.params.id
    if (!await app.DAO.rol.buscar({id_rol: ID_ROL})) {
      throw new errors.PreconditionError([{
        path: 'params.id',
        value: ID_ROL,
        msg: `No se encuentra el registro del rol solicitado.`
      }])
    }
  }

  MIDDLEWARE.crear = async (req) => {
    const CODIGO = req.body.codigo
    if (await app.DAO.rol.buscar({ codigo: CODIGO })) {
      throw new errors.PreconditionError([{
        path: 'body.codigo',
        value: CODIGO,
        msg: `El código de rol ya se encuentra registrado.`
      }])
    }
  }

  MIDDLEWARE.actualizar = async (req) => {
    const CODIGO = req.body.codigo
    const NOMBRE = req.body.nombre
    const ID_ROL = req.params.id
    if (!await app.DAO.rol.buscar({ id_rol: ID_ROL })) {
      throw new errors.PreconditionError([{
        path: 'params.id',
        value: ID_ROL,
        msg: `No se encuentra el registro del rol que desea actualizar.`
      }])
    }
    if (!CODIGO && !NOMBRE) {
      throw new errors.PreconditionError([{
        path: 'body.codigo | body.nombre',
        value: `${CODIGO} | ${NOMBRE}`,
        msg: `Debe enviar al menos un dato válido, para actualizar el registro del rol.`
      }])
    }
    if (CODIGO && await app.DAO.rol.buscar({ codigo: CODIGO }, { id_rol: ID_ROL })) {
      throw new errors.PreconditionError([{
        path: 'body.codigo',
        value: CODIGO,
        msg: `El nombre de rol ya se encuentra registrado.`
      }])
    }
  }

  MIDDLEWARE.eliminar = async (req) => {
    const ID_ROL = req.params.id
    if (!await app.DAO.rol.buscar({ id_rol: ID_ROL })) {
      throw new errors.PreconditionError([{
        path: 'params.id',
        value: ID_ROL,
        msg: `No se encuentra el registro del rol que desea eliminar.`
      }])
    }
  }

  return MIDDLEWARE
}
