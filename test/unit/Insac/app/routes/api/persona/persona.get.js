'use strict'
const { Field } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('GET', '/api/personas', {
    model: models.persona,
    output: [{
      id: Field.THIS(),
      nombre: Field.THIS(),
      id_usuario: Field.THIS(),
      usuario: {
        username: Field.THIS(),
        password: Field.THIS()
      }
    }],
    controller: (req) => {
      return db.persona.findAll(res.options)
    }
  })

  insac.addRoute('GET', '/api/personas/:id', {
    model: models.persona,
    input: {
      params: {
        id: Field.THIS()
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
      let options = res.options
      options.where = { id: req.params.id }
      return db.persona.findOne(options)
    }
  })

}
