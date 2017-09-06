'use strict'
const { Field } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('GET', '/usuarios', {
    model: models.usuario,
    output: [{
      id: Field.THIS,
      username: Field.THIS,
      password: Field.THIS,
      persona: {
        id: Field.THIS,
        nombre: Field.THIS,
        id_usuario: Field.THIS,
        usuario: {
          id: Field.THIS,
          username: Field.THIS,
          password: Field.THIS,
          persona: {
            id: Field.THIS,
            nombre: Field.THIS,
            id_usuario: Field.THIS,
            usuario: {
              id: Field.THIS,
              username: Field.THIS,
              password: Field.THIS
            }
          }
        }
      }
    }],
    controller: (req, res, next) => {
      let options = req.options
      db.usuario.findAll(options).then(personaR => {
        res.success200(personaR)
      }).catch(err => {
        res.error(err)
      })
    }
  })

}
