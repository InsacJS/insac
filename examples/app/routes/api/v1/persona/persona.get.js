'use strict'
const { Field, DataTypes, Validators, NotFoundError } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('GET', '/api/v1/personas', {
    model: models.persona,
    output: [{
      id: Field.THIS(),
      nombre: Field.THIS(),
      id_usuario: Field.THIS(),
      usuario: {
        id: Field.THIS(),
        username: Field.THIS(),
        password: Field.THIS()
      },
      inscripciones: [{
        id: Field.THIS(),
        gestion: Field.THIS(),
        id_persona: Field.THIS(),
        id_materia: Field.THIS(),
        materia: {
          id: Field.THIS(),
          nombre: Field.THIS(),
          sigla: Field.THIS()
        }
      }]
    }],
    controller: (req) => {
      return db.persona.findAll(req.options)
    }
  })

  insac.addRoute('GET', '/api/v1/personas/:id', {
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
        id: Field.THIS(),
        username: Field.THIS(),
        password: Field.THIS()
      },
      inscripciones: [{
        id: Field.THIS(),
        gestion: Field.THIS(),
        id_persona: Field.THIS(),
        id_materia: Field.THIS(),
        persona: {
          id: Field.THIS(),
          nombre: Field.THIS(),
          id_usuario: Field.THIS(),
          usuario: {
            id: Field.THIS(),
            username: Field.THIS(),
            password: Field.THIS()
          },
          inscripciones: [{
            id: Field.THIS(),
            gestion: Field.THIS(),
            persona: {
              id: Field.THIS(),
              nombre: Field.THIS()
            }
          }]
        },
        materia: {
          id: Field.THIS(),
          nombre: Field.THIS(),
          sigla: Field.THIS()
        }
      }]
    },
    controller: (req) => {
      req.options.where = { id: req.params.id }
      return db.persona.findOne(req.options)
    }
  })

}
