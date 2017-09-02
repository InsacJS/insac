'use strict'
const { Field } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('PUT', '/api/personas/:id', {
    model: models.persona,
    req: {
      params: {
        id: Field.THIS
      },
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
        let options1 = { where: { id:req.params.id } }
        return db.usuario.update(usuario, options1, {transaction:t}).then(result => {
          if (result > 0) {
            return db.persona.findOne(options1).then(personaR => {
              let persona = { nombre: req.body.nombre }
              let options2 = { where: { id:personaR.id_usuario } }
              return db.persona.update(persona, options2, {transaction:t}).then(result => {
                return db.persona.findOne(options1)
              })
            })
          } else {
            let msg = `No existe el registro 'persona' con el campo (id)=(${req.params.id})`
            throw new ResponseError(404, msg)
          }
        })
      }).then(result => {
        res.success201(result)
      }).catch(err => {
        res.error(err)
      })
    }
  })

}
