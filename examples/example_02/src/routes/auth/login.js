'use strict'

module.exports = (insac, models, Field, Data, Validator, Util) => {

  let routes = []

  routes.push(insac.createRoute('POST', '/auth/login', {
    model: models.persona,
    input: {
      body: {
        username: models.usuario.fields.username,
        password: models.usuario.fields.password
      }
    },
    output: {
      data: {
        token_acceso: Field.ACCESS_TOKEN,
        usuario: {
          id: models.usuario.fields.id,
          nombre: models.usuario.fields.nombre,
          roles: [{
            id: models.rol.fields.id,
            nombre: models.rol.fields.nombre,
            alias: models.rol.fields.alias
          }]
        },
        id_estudiante: models.estudiante.fields.id,
        id_docente: models.docente.fields.id
      }
    },
    controller: (req, res, opt, next) => {
      let options = {
        where: {
          username: opt.input.body.username,
          password: insac.encryptPassword(opt.input.body.password)
        },
        include: [
          {model: opt.models.usuario_rol.seq, as:'usuarios_roles', where:{estado:'ACTIVO'}, include: [
            {model: opt.models.rol.seq, as:'rol', attributes:['id', 'nombre', 'alias']}
          ]},
          {model: opt.models.persona.seq, as:'persona', include:[
            {model: opt.models.estudiante.seq, as:'estudiante', attributes:['id']},
            {model: opt.models.docente.seq, as:'docente', attributes:['id']}
          ]}
        ]
      }
      models.usuario.seq.findOne(options).then((usuarioR) => {
        if (usuarioR) {
          let data = {
            usuario: {
              id: usuarioR.id,
              nombre: usuarioR.nombre,
              roles: []
            }
          }
          if (usuarioR.persona.estudiante != null) data.id_estudiante = usuarioR.persona.estudiante.id
          if (usuarioR.persona.docente != null) data.id_docente = usuarioR.persona.docente.id
          for (let i in usuarioR.usuarios_roles) {
            data.usuario.roles.push(usuarioR.usuarios_roles[i].rol)
          }
          data.token_acceso = insac.createToken(data)
          res.success200(data)
        } else {
          let msg = `Usuario y/o contraseña incorrecta`
          res.error401(msg)
        }
      }).catch(function (err) {
        res.error(err)
      })
    }
  }))

  return routes

}
