'use strict'

module.exports = (insac) => {

  return insac.database.sequelize.transaction(t => {
    let rol = {
      nombre: 'Docente',
      alias: 'doc',
      description: 'Rol del docente'
    }
    return insac.models.rol.seq.create(rol, {transaction:t}).then(rolR => {
      let usuario = {
        username: 'doc',
        password: insac.encryptPassword('doc'),
        nombre: "Nombre del docente"
      }
      return insac.models.usuario.seq.create(usuario, {transaction:t}).then(usuarioR => {
        let usuario_rol = {
          estado: 'ACTIVO',
          id_usuario: usuarioR.id,
          id_rol: rolR.id
        }
        return insac.models.usuario_rol.seq.create(usuario_rol, {transaction:t}).then(usuarioRolR => {
          let persona = {
            ci: 2000,
            id_usuario: usuarioR.id
          }
          return insac.models.persona.seq.create(persona, {transaction:t}).then(personaR => {
            let docente = {
              grado: 'Licenciado',
              id_persona: personaR.id
            }
            return insac.models.docente.seq.create(docente, {transaction:t}).then(docenteR => {
              console.log(" - Seed complete 'docente'")
            })
          })
        })
      })
    })

  })

}
