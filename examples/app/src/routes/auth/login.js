'use strict'
const { Route, Fields } = require(INSAC)
const { UnauthorizedError } = require(INSAC).ResponseErrors

module.exports = (insac, models, db) => {

  const Usuario = models.usuario.fields
  const Rol = models.rol.fields

  return new Route('POST', `/auth/login`, {
    group: 'Auth',
    title: 'Login',
    input: {
      body: {
        username: Fields.COPY(Usuario.username, {required:true}),
        password: Fields.COPY(Usuario.password, {required:true})
      }
    },
    output: {
      token: Fields.TOKEN(),
      usuario: {
        id: Fields.COPY(Usuario.id),
        nombre: Fields.COPY(Usuario.nombre),
        email: Fields.COPY(Usuario.email),
        roles: [{
          id: Fields.COPY(Rol.id),
          nombre: Fields.COPY(Rol.nombre),
          alias: Fields.COPY(Rol.alias)
        }]
      },
      id_administrativo: Fields.INTEGER({description:'Identificador único del administrativo.', required:false}),
      id_docente: Fields.INTEGER({description:'Identificador único del docente.', required:false}),
      id_estudiante: Fields.INTEGER({description:'Identificador único del estudiante.', required:false})
    },
    controller: (req) => {
      let usuarioOptions = {
        where: {
          username: req.body.username,
          password: insac.encryptPassword(req.body.password)
        },
        include: [
          {model: db.rol_usuario, as:'roles_usuarios', where:{estado:'ACTIVO'}, include: [
            {model: db.rol, as:'rol'}
          ]},
          {model: db.persona, as:'persona', include:[
            {model: db.administrativo, as:'administrativo'},
            {model: db.estudiante, as:'estudiante'},
            {model: db.docente, as:'docente'}
          ]}
        ]
      }
      return db.usuario.findOne(usuarioOptions).then(usuarioR => {
        if (!usuarioR) {
          throw new UnauthorizedError(`Usuario y/o contraseña incorrecto.`)
        }
        let data = {
          usuario: {
            id: usuarioR.id,
            nombre: usuarioR.nombre,
            email: usuarioR.email
          }
        }
        if (usuarioR.persona.administrativo != null) { data.id_administrativo = usuarioR.persona.administrativo.id }
        if (usuarioR.persona.docente != null) { data.id_docente = usuarioR.persona.docente.id }
        if (usuarioR.persona.estudiante != null) { data.id_estudiante = usuarioR.persona.estudiante.id }
        let roles = [], tokenRoles = []
        for (let i in usuarioR.roles_usuarios) {
          roles.push(usuarioR.roles_usuarios[i].rol)
          tokenRoles.push(usuarioR.roles_usuarios[i].rol.alias)
        }
        data.usuario.roles = roles
        let tokenData = {
          usuario: { id:usuarioR.id },
          nombre: usuarioR.nombre,
          id_administrativo: data.id_administrativo,
          id_docente: data.id_docente,
          id_estudiante: data.id_estudiante,
          roles: tokenRoles
        }
        data.token = insac.createToken(tokenData)
        return data
      })
    }
  })

}
