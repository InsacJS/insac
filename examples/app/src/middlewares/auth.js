'use strict'
const { Middleware, Fields, Validators } = require(INSAC)
const { ForbiddenError } = require(INSAC).ResponseErrors

module.exports = (insac, models, db, args) => {

  return new Middleware('auth', {
    input: {
      headers: {
        authorization: Fields.TOKEN({validator:Validators.STRING(1,500)})
      }
    },
    controller: (req, res, next) => {
      if (req.method == 'OPTIONS') { return next() }
      // Decodifica el token
      let tokenData = insac.decodeToken(req.headers.authorization)
      for (let i in tokenData.roles) {
        if (args.rol == tokenData.roles[i]) {
          let options = {where: { estado:'ACTIVO' }, include:[
            { model:db.rol, as:'rol', where:{ alias:args.rol } }
          ]}
          // Verifica si la cuenta esta activa o inactiva
          return db.rol_usuario.findOne(options).then(rolUsuarioR => {
            if (!rolUsuarioR) {
              throw new ForbiddenError(`La cuenta ha sido deshabilitada.`)
            }
            // Guarda los datos del token
            req.token = tokenData
            return next()
          })
        }
      }
      throw new ForbiddenError(`No tiene los privilegios suficientes para acceder a este recurso`)
    }
  })

}
