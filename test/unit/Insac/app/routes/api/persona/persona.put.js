'use strict'
const { Field, NotFoundError } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('PUT', '/api/personas/:id', {
    model: models.persona,
    input: {
      params: {
        id: Field.THIS()
      },
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
        let options1 = { where: { id:req.params.id } }
        return db.usuario.update(usuario, options1, {transaction:t}).then(result => {
          if (result > 0) {
            return db.persona.findOne(options1).then(personaR => {
              let persona = { nombre: req.body.nombre }
              let options2 = { where: { id:personaR.id_usuario } }
              return db.persona.update(persona, options2, {transaction:t})
            })
          } else {
            throw new NotFoundError('persona', 'id', req.params.id)
          }
        })
      }).then(result => {
        let options = req.options
        options.where = { id:req.params.id }
        return db.persona.findOne(options)
      })
    }
  })

}
