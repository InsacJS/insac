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
        password: Field.THIS(),
        custom: Field.INTEGER()
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
    controller: (req, res, next) => {
      let options = req.options
      db.persona.findAll(options).then(personaR => {
        let cnt = 10
        for (let i in personaR) {
          personaR[i].usuario.custom = cnt
          cnt += 10
        }
        return res.success200(personaR)
      }).catch(err => {
        res.error(err)
      })
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
      custom: Field.INTEGER(),
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
    controller: (req, res, next) => {
      let options = req.options
      options.where = { id: req.params.id }
      db.persona.findOne(options).then(personaR => {
        if (!personaR) {
          throw new NotFoundError('persona', 'id', req.params.id)
        }
        personaR.custom = 10
        res.success200(personaR)
      }).catch(err => {
        res.error(err)
      })
    }
  })

}
