'use strict'
const { Field, DataTypes, Validators, NotFoundError } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('DELETE', '/api/v1/personas/:id', {
    model: models.persona,
    input: {
      headers: {
        authorization: Field.AUTHORIZATION({allowNull:true})
      },
      params: {
        id: Field.THIS()
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
      let options = req.options
      options.where = {id: req.params.id }
      return db.persona.findOne(options).then(personaR => {
        if (!personaR) {
          throw new NotFoundError('persona', 'id', req.params.id)
        }
        return db.persona.destroy(options).then(result => {
          return db.usuario.destroy({where:{id:personaR.id_usuario}}).then(result => {
            return personaR
          })
        })
      })
    }
  })

}
