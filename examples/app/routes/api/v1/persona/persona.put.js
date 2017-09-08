'use strict'
const { Field, DataTypes, Validators, NotFoundError } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('PUT', '/api/v1/personas/:id', {
    model: models.persona,
    input: {
      headers: {
        authorization: Field.AUTHORIZATION({allowNull:true})
      },
      params: {
        id: Field.THIS()
      },
      body: {
        nombre: Field.THIS({allowNull:true}),
        usuario: {
          username: Field.THIS({allowNull:true}),
          password: Field.THIS({allowNull:true})
        }
      }
    },
    output: {
      id: Field.THIS(),
      nombre: Field.THIS(),
      id_usuario: Field.THIS(),
      usuario: {
        id: Field.THIS(),
        username: Field.THIS(),
        password: Field.THIS()
      }
    },
    controller: (req) => {
      return db.sequelize.transaction(t => {
        let options = { where: {id: req.params.id } }
        return db.persona.findOne(options).then(personaR => {
          if (!personaR) {
            throw new NotFoundError('persona', 'id', req.params.id)
          }
          let usuario = {}
          if (req.body.usuario && req.body.usuario.username) usuario.username = req.body.usuario.username
          if (req.body.usuario && req.body.usuario.password) usuario.password = req.body.usuario.password
          return db.usuario.update(usuario, {where:{id:personaR.id_usuario}}, {transaction:t}).then(result => {
            let persona = { }
            if (typeof req.body.nombre != 'undefined') persona.nombre = req.body.nombre
            return db.persona.update(persona, options, {transaction:t})
          })
        })
      }).then(result => {
        let options = req.options
        options.where = { id:req.params.id }
        return db.persona.findOne(options)
      })
    }
  })

}
