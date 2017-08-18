'use strict'

module.exports = (insac) => {

  return insac.createMiddleware('authorization', (req, res, opt, next) => {
    if (req.method == 'OPTIONS') {
      return next()
    }
    // Obtiene el token del campo authorization
    var token = opt.input.headers.authorization
    // Decodifica el token
    let tokenDecoded = insac.decodeToken(token)
    // Verifica si el token es válido
    if (typeof tokenDecoded == 'undefined') {
      return res.error401('Token inválido')
    }
    // Verifica si el token ha expirado
    if (tokenDecoded.exp <= Date.now()) {
      return res.error401('Token expirado')
    }
    // Verifica si el usuario tiene acceso al recurso
    for (let i in opt.roles) {
      for (let j in tokenDecoded.data.usuario.roles) {
        if (opt.roles[i] == tokenDecoded.data.usuario.roles[j].alias) {
          let options = {where:{estado:'ACTIVO'}, include:[
            {model:insac.models.rol.seq, as:'rol', where:{alias:opt.roles[i]}}
          ]}
          // Verifica si la cuenta esta activa o inactiva
          insac.models.usuario_rol.seq.findOne(options).then(usuarioRolR => {
            if (usuarioRolR) {
              // Guarda los datos del token
              opt.data.token = tokenDecoded.data
              next()
            } else {
              res.error403('La cuenta se encuentra INACTIVA, comuníquese con el administrador')
            }
          })
          return
        }
      }
    }
    res.error403('No tiene los privilegios suficientes para acceder al recurso')
  })

}
