'use strict'
const { Field } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('POST', '/api/personas', {
    model: models.persona,
    req: {
      body: {
        nombre: Field.THIS,
        usuario: {
          username: Field.THIS,
          password: Field.THIS
        }
      }
    },
    res: {
      data: {
        id: Field.THIS,
        nombre: Field.THIS,
        id_usuario: Field.THIS,
        usuario: {
          usename: Field.THIS,
          password: Field.THIS
        }
      }
    },
    controller: (req, res, next) => {
      db.sequelize.transaction(t => {
        let usuario = req.body.usuario
        return db.usuario.create(usuario, {transaction:t}).then(usuarioR => {
          let persona = { nombre: req.body.nombre, id_usuario: usuarioR.id }
          return db.persona.create(persona, {transaction:t}).then(personaR => {
            return db.persona.findOne(res.options)
          })
        })
      }).then(result => {
        res.success201(result)
      }).catch(err => {
        res.error(err)
      })
    }
  })

}
