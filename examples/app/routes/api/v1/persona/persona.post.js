'use strict'
const { Field, DataTypes, Validators, NotFoundError } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('POST', '/api/v1/personas', {
    model: models.persona,
    input: {
      headers: {
        authorization: Field.AUTHORIZATION({allowNull:true})
      },
      body: {
        custom: Field.STRING(100, {allowNull:false}),
        nombre: Field.THIS({allowNull:false}),
        usuario: {
          username: Field.THIS({allowNull:false}),
          password: Field.THIS({allowNull:false})
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
        let usuario = {
          username: req.body.usuario.username,
          password: req.body.usuario.password
        }
        return db.usuario.create(usuario, {transaction:t}).then(usuarioR => {
          let persona = {
            nombre: req.body.nombre,
            id_usuario: usuarioR.id
          }
          return db.persona.create(persona, {transaction:t})
        })
      }).then(result => {
        let options = req.options
        options.where = { id:result.id }
        db.persona.findOne(options).then(result => {
          return result
        })
      })
    }
  })

}
