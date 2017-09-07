'use strict'
const { Field, DataTypes, Validators } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('GET', '/personas', {
    model: models.persona,
    output: [{
      id: Field.THIS(),
      nombre: Field.THIS(),
      id_usuario: Field.THIS(),
      usuario: {
        id: Field.THIS(),
        username: Field.THIS(),
        password: Field.THIS(),
        custom: Field.CUSTOM()
      },
      inscripciones: [{
        id: Field.THIS(),
        gestion: Field.THIS(),
        id_persona: Field.THIS(),
        id_materia: Field.THIS(),
        materia: {
          id: Field.THIS(),
          nombre: Field.THIS()
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

  insac.addRoute('GET', '/personas/:id', {
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
      custom: Field.CUSTOM({type:DataTypes.INTEGER()}),
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
          }
        },
        materia: {
          id: Field.THIS(),
          nombre: Field.THIS()
        }
      }]
    },
    controller: (req, res, next) => {
      let options = req.options
      options.where = { id: req.params.id }
      db.persona.findOne(options).then(personaR => {
        if (personaR) {
          personaR.custom = 10
          return res.success200(personaR)
        }
        res.error422(`No existe el registro 'persona' con (id)=(${req.params.id})`)
      }).catch(err => {
        res.error(err)
      })
    }
  })

  insac.addRoute('POST', '/personas', {
    model: models.persona,
    input: {
      headers: {
        authorization: Field.CUSTOM()
      },
      body: {
        custom: Field.CUSTOM({type:DataTypes.INTEGER()}),
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
    controller: (req, res, next) => {
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
        req.options.where = { id:result.id }
        db.persona.findOne(options).then(result => {
          res.success201(result)
        }).catch(err => {
          res.error(err)
        })
      }).catch(err => {
        res.error(err)
      })
    }
  })

}
