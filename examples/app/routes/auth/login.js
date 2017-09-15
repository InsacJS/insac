'use strict'
const { Route, Fields } = require(INSAC)
const { UnauthorizedError } = require(INSAC).ResponseErrors

module.exports = (insac, models, db) => {

  return new Route('POST', `/auth/login`, {
    input: {
      body: {
        username: Fields.COPY(models.usuario.fields.username, {allowNull:false}),
        password: Fields.COPY(models.usuario.fields.password, {allowNull:false})
      }
    },
    output: {
      token: Fields.TOKEN(),
      usuario: {
        id: models.usuario.fields.id,
        nombre: models.usuario.fields.nombre,
        email: models.usuario.fields.email,
        roles: [{
          id: models.rol.fields.id,
          nombre: models.rol.fields.nombre,
          alias: models.rol.fields.alias,
          descripcion: models.rol.fields.descripcion
        }]
      },
      id_administrativo: Fields.INTEGER({description:'Identificador único del administrativo'}),
      id_docente: Fields.INTEGER({description:'Identificador único del docente'}),
      id_estudiante: Fields.INTEGER({description:'Identificador único del estudiante'})
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
