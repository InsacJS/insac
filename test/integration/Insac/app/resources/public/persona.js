'use strict'
const { Resource, Fields } = require(INSAC)
const { NotFoundError } = require(INSAC).ResponseErrors

module.exports = (insac, models, db) => {

  let resource = new Resource('persona', '/api/v1/personas', {
    model: models.persona,
    vesion: 1,
    output: {
      id: Fields.THIS(),
      nombre: Fields.THIS(),
      id_usuario: Fields.THIS(),
      usuario: {
        username: Fields.THIS(),
        password: Fields.THIS()
      }
    }
  })

  resource.addRoute('GET', `/`, {
    output: [resource.output],
    controller: (req) => {
      let options = req.options
      return db.persona.findAll(options)
    }
  })

  resource.addRoute('GET', `/:id`, {
    input: {
      params: {
        id: Fields.THIS({required:true})
      }
    },
    controller: (req) => {
      let options = req.options
      options.where = {id:req.params.id}
      return db.persona.findOne(options).then(personaR => {
        if (!personaR) {
          throw new NotFoundError()
        }
        return personaR
      })
    }
  })

  resource.addRoute('POST', `/`, {
    input: {
      body: {
        nombre: Field.THIS(),
        usuario: {
          username: Field.THIS(),
          password: Field.THIS()
        }
      }
    },
    controller: (req) => {
      return db.sequelize.transaction(t => {
        let usuario = req.body.usuario
        return db.usuario.create(usuario, {transaction:t}).then(usuarioR => {
          let persona = { nombre: req.body.nombre, id_usuario: usuarioR.id }
          return db.persona.create(persona, {transaction:t})
        })
      }).then(result => {
        let options = req.options
        options.where = { id:result.id }
        return db.persona.findOne(options)
      })
    }
  })

  resource.addRoute('PUT', `/:id`, {
    input: {
      params: {
        id: Fields.THIS({required:true})
      },
      body: {
        nombre: Field.THIS(),
        usuario: {
          username: Field.THIS(),
          password: Field.THIS()
        }
      }
    },
    controller: (req) => {
      return db.sequelize.transaction(t => {
        let usuario = req.body.usuario
        let options1 = { where: { id:req.params.id } }
        return db.usuario.update(usuario, options1, {transaction:t}).then(result => {
          if (result > 0) {
            return db.persona.findOne(options1).then(personaR => {
              let persona = { nombre: req.body.nombre }
              let options2 = { where: { id:personaR.id_usuario } }
              return db.persona.update(persona, options2, {transaction:t})
            })
          } else {
            throw new NotFoundError('persona', 'id', req.params.id)
          }
        })
      }).then(result => {
        let options = req.options
        options.where = { id:req.params.id }
        return db.persona.findOne(options)
      })
    }
  })

  resource.addRoute('DELETE', `/:id`, {
    input: {
      params: {
        id: Fields.THIS({required:true})
      }
    },
    controller: (req) => {
      let options = req.options
      options.where = { id:req.params.id }
      return db.persona.findOne(options).then(personaR => {
        if (!personaR) {
          throw new NotFoundError()
        }
        return db.persona.destroy(options).then(result => {
          return carreraR
        })
      })
    }
  })

  return resource

}
