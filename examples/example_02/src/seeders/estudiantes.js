'use strict'

module.exports = (insac) => {

  return insac.database.sequelize.transaction(t => {
    let rol = {
      nombre: 'Estudiante',
      alias: 'est',
      description: 'Rol del estudiante'
    }
    return insac.models.rol.seq.create(rol, {transaction:t}).then(rolR => {
      let usuario = {
        username: 'est',
        password: insac.encryptPassword('est'),
        nombre: "Nombre del estudiante"
      }
      return insac.models.usuario.seq.create(usuario, {transaction:t}).then(usuarioR => {
        let usuario_rol = {
          estado: 'INACTIVO',
          id_usuario: usuarioR.id,
          id_rol: rolR.id
        }
        return insac.models.usuario_rol.seq.create(usuario_rol, {transaction:t}).then(usuarioRolR => {
          let persona = {
            ci: 1000,
            id_usuario: usuarioR.id
          }
          return insac.models.persona.seq.create(persona, {transaction:t}).then(personaR => {
            let estudiante = {
              ru: 100,
              id_persona: personaR.id
            }
            return insac.models.estudiante.seq.create(estudiante, {transaction:t}).then(estudianteR => {
              console.log(" - Seed complete 'estudiante'")
            })
          })
        })
      })
    })

  })

}
