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
    controller: (req, res, next) => {
      db.persona.findAll(res.options).then(result => {
        res.success200(result)
      }).catch(function (err) {
        res.error(err)
      })
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
    controller: (req, res, next) => {
      let options = res.options
      options.where = { id: req.params.id }
      db.persona.findOne(options).then(result => {
        if (result) {
          res.success200(result)
        } else {
          let msg = `No existe el registro 'persona' con el campo (id)=(${req.params.id})`
          res.error404(msg)
        }
      }).catch(function (err) {
        res.error(err)
      })
    }
  })

}
