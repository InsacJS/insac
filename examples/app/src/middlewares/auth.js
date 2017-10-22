'use strict'
const { Middleware, Fields, Validators, ResponseErrors } = require(INSAC)
const { ForbiddenError } = ResponseErrors

module.exports = (insac, models, db) => {

  function createMiddleware(rol) {

    return new Middleware(`${rol}Middleware`, (req, res, next) => {
      controller: (req, res, next) => {
        if (req.method == 'OPTIONS') { return next() }
        // Decodifica el token
        let tokenData = insac.decodeToken(req.headers.authorization)
        for (let i in tokenData.roles) {
          if (rol == tokenData.roles[i]) {
            let rolUsuarioOptions = {
              where: {
                estado: 'ACTIVO'
              },
              include: [{
                model: db.rol,
                as: 'rol',
                required: true,
                where: {
                  alias: rol
                }
              }]
            }
            // Verifica si la cuenta esta activa o inactiva
            return db.rol_usuario.findOne(rolUsuarioOptions).then(rolUsuarioR => {
              if (!rolUsuarioR) {
                throw new ForbiddenError(`La cuenta ha sido deshabilitada.`)
              }
              // Guarda los datos del token
              req.token = tokenData
              return next()
            })
          }
        }
        throw new ForbiddenError(`No tiene los privilegios suficientes para acceder a este recurso.`)
      }
    })

  }

  return [
    createMiddleware('admin'),
    createMiddleware('doc'),
    createMiddleware('est')
  ]

}
