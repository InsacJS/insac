'use strict'
const { Resource, Fields } = require(INSAC)
const { NotFoundError } = require(INSAC).ResponseErrors

module.exports = (insac, models, db) => {

  let resource = new Resource('administrativo', '/api/v1/administrativos', {
    model: models.administrativo,
    vesion: 1,
    rol: 'admin',
    middlewares: [ { name: 'auth', args: { rol:'admin' } } ],
    output: {
      id: Fields.THIS(),
      cargo: Fields.THIS(),
      id_persona: Fields.THIS(),
      persona: {
        id: Fields.THIS(),
        nombre: Fields.THIS(),
        paterno: Fields.THIS(),
        materno: Fields.THIS(),
        ci: Fields.THIS()
      }
    }
  })

  resource.addRoute('GET', `/`, {
    output: [resource.output],
    controller: (req) => {
      let options = req.options
      return db.administrativo.findAll(options)
    }
  })

  resource.addRoute('GET', `/mi`, {
    output: {
      id: Fields.THIS(),
      cargo: Fields.THIS(),
      id_persona: Fields.THIS(),
      persona: {
        id: Fields.THIS(),
        nombre: Fields.THIS(),
        paterno: Fields.THIS(),
        materno: Fields.THIS(),
        ci: Fields.THIS(),
        email: Fields.THIS(),
        direccion: Fields.THIS(),
        telefono: Fields.THIS(),
        id_usuario: Fields.THIS(),
        usuario: {
          id: Fields.THIS(),
          username: Fields.THIS(),
          password: Fields.THIS(),
          nombre: Fields.THIS(),
          email: Fields.THIS()
        }
      }
    },
    controller: (req) => {
      let options = req.options
      options.where = {id:req.token.id_administrativo}
      return db.administrativo.findOne(options).then(administrativoR => {
        if (!administrativoR) {
          throw new NotFoundError()
        }
        return administrativoR
      })
    }
  })

  resource.addRoute('GET', `/:id`, {
    input: {
      params: {
        id: Fields.THIS({allowNull:false})
      }
    },
    controller: (req) => {
      let options = req.options
      options.where = {id:req.params.id}
      return db.administrativo.findOne(options).then(administrativoR => {
        if (!administrativoR) {
          throw new NotFoundError()
        }
        return administrativoR
      })
    }
  })

  resource.addRoute('POST', `/`, {
    input: {
      body: {
        cargo: Fields.THIS(),
        persona: {
          nombre: Fields.THIS(),
          paterno: Fields.THIS(),
          materno: Fields.THIS(),
          ci: Fields.THIS(),
          email: Fields.THIS(),
          direccion: Fields.THIS(),
          telefono: Fields.THIS()
        }
      }
    },
    controller: (req) => {
      return db.sequelize.transaction(t => {
        let usuario = {
          username: req.body.persona.ci,
          password: req.body.persona.ci,
          nombre: `${req.body.persona.nombre} ${req.body.persona.paterno} ${req.body.persona.materno}`,
          email: req.body.persona.email
        }
        return db.usuario.create(usuario, {transaction:t}).then(usuarioR => {
          let persona = req.body.persona
          persona.id_usuario = usuarioR.id
          return db.persona.create(persona, {transaction:t}).then(personaR => {
            let administrativo = {
              cargo: req.body.cargo,
              id_persona: personaR.id
            }
            return db.administrativo.create(administrativo, {transaction:t})
          })
        })
      }).then(result => {
        let options = req.options
        options.where = { id:result.id }
        return db.administrativo.findOne(options)
      })
    }
  })

  resource.addRoute('PUT', `/:id`, {
    input: {
      params: {
        id: Fields.THIS({allowNull:false})
      },
      body: {
        cargo: Fields.THIS({allowNull:true}),
        persona: {
          nombre: Fields.THIS({allowNull:true}),
          paterno: Fields.THIS({allowNull:true}),
          materno: Fields.THIS({allowNull:true}),
          ci: Fields.THIS({allowNull:true}),
          email: Fields.THIS({allowNull:true}),
          direccion: Fields.THIS({allowNull:true}),
          telefono: Fields.THIS({allowNull:true})
        }
      }
    },
    controller: (req) => {
      return db.sequelize.transaction(t => {
        let options = {where: {id:req.params.id}, include:[
          {model:db.persona, as:'persona'}
        ]}
        return db.administrativo.findOne(options).then(administrativoR => {
          if (!administrativoR) {
            throw new NotFoundError()
          }
          options = {where: {id:administrativoR.persona.id_usuario} }
          let usuario = { }
          if (req.body.persona && req.body.persona.nombre) usuario.nombre = req.body.persona.nombre
          if (req.body.persona && req.body.persona.email) usuario.email = req.body.persona.email
          return db.usuario.update(usuario, options, {transaction:t}).then(usuarioR => {
            let persona = req.body.persona
            persona.id_usuario = usuarioR.id
            return db.persona.update(persona, options, {transaction:t}).then(personaR => {
              let administrativo = { }
              if (req.body.cargo && req.body.cargo) administrativo.cargo = req.body.cargo
              return db.administrativo.create(administrativo, {transaction:t})
            })
          })
        })
      }).then(result => {
        let options = req.options
        options.where = { id:req.params.id }
        return db.administrativo.findOne(options)
      })
    }
  })

  resource.addRoute('DELETE', `/:id`, {
    input: {
      params: {
        id: Fields.THIS({allowNull:false})
      }
    },
    controller: (req) => {
      let options = req.options
      options.where = { id:req.params.id }
      return db.administrativo.findOne(options).then(administrativoR => {
        if (!administrativoR) {
          throw new NotFoundError()
        }
        return db.administrativo.destroy(options).then(result => {
          return carreraR
        })
      })
    }
  })

  return resource

}
