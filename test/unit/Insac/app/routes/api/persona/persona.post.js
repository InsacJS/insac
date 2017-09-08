'use strict'
const { Field } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('POST', '/api/personas', {
    model: models.persona,
    input: {
      body: {
        nombre: Field.THIS(),
        usuario: {
          username: Field.THIS(),
          password: Field.THIS()
        }
      }
    },
    output: {
      id: Field.THIS(),
      nombre: Field.THIS(),
      id_usuario: Field.THIS(),
      usuario: {
        username: Field.THIS(),
        password: Field.THIS()
      }
    },
    controller: (req) => {
      db.sequelize.transaction(t => {
        let usuario = req.body.usuario
        return db.usuario.create(usuario, {transaction:t}).then(usuarioR => {
          let persona = { nombre: req.body.nombre, id_usuario: usuarioR.id }
          return db.persona.create(persona, {transaction:t})
        })
      }).then(result => {
        let options = req.options
        options.where = { id:result.id }
        return db.persona.findOne(options)
      })
    }
  })

}
