'use strict'
const { Field } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('DELETE', '/api/personas/:id', {
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
      let options1 = res.options
      options1.where = { id:req.params.id }
      db.persona.findOne(options1).then(personaR => {
        if (personaR) {
          let options2 = { where: { id:req.params.id } }
          db.persona.destroy(options2).then(result => {
            res.success200(personaR)
          })
        } else {
          let msg = `No existe el registro 'persona' con el campo (id)=(${req.params.id})`
          res.error404(msg)
        }
      }).catch((err) => {
        res.error(err)
      })
    }
  })

}
