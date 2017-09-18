'use strict'
const { Route, Fields } = require(INSAC)
const { UnauthorizedError } = require(INSAC).ResponseErrors

module.exports = (insac, models, db) => {

  return new Route('POST', `/auth/login`, {
    group: 'Auth',
    title: 'Login',
    input: {
      body: {
        username: Fields.COPY(models.usuario.fields.username, {required:true}),
        password: Fields.COPY(models.usuario.fields.password, {required:true})
      }
    },
    output: {
      token: Fields.TOKEN({required:true}),
      usuario: {
        id: Fields.COPY(models.usuario.fields.id, {required:false}),
        nombre: Fields.COPY(models.usuario.fields.nombre, {required:false}),
        email: Fields.COPY(models.usuario.fields.email, {required:false}),
        roles: [{
          id: Fields.COPY(models.rol.fields.id, {required:false}),
          nombre: Fields.COPY(models.rol.fields.nombre, {required:false}),
          alias: Fields.COPY(models.rol.fields.alias, {required:false})
        }]
      },
      id_administrativo: Fields.INTEGER({description:'Identificador único del administrativo', required:false}),
      id_docente: Fields.INTEGER({description:'Identificador único del docente', required:false}),
      id_estudiante: Fields.INTEGER({description:'Identificador único del estudiante', required:false})
    },
    controller: (req) => {
      let options = {
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
      return db.usuario.findOne(options).then(usuarioR => {
        if (!usuarioR) {
          throw new UnauthorizedError(`Usuario y/o contraseña incorrecta`)
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
