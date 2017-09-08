'use strict'
const { Field } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('GET', '/api/v1/usuarios', {
    model: models.usuario,
    output: [{
      id: Field.THIS(),
      username: Field.THIS(),
      password: Field.THIS(),
      persona: {
        id: Field.THIS(),
        nombre: Field.THIS(),
        id_usuario: Field.THIS()
      }
    }],
    controller: (req) => {
      let options = req.options
      db.usuario.findAll(options).then(personaR => {
        return personaR
      })
    }
  })

}
