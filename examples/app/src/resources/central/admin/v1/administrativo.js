'use strict'
const { Resource, Fields } = require(INSAC)
const { NotFoundError } = require(INSAC).ResponseErrors

module.exports = (insac, models, db) => {

  let resource = new Resource('administrativo', '/api/v1/administrativos', {
    model: models.administrativo,
    version: 1,
    rol: 'admin',
    middlewares: [ { name: 'auth', args: { rol:'admin' } } ],
    output: {
      id: Fields.THIS({required:false}),
      cargo: Fields.THIS({required:false}),
      id_persona: Fields.THIS({required:false}),
      persona: {
        id: Fields.THIS({required:false}),
        nombre: Fields.THIS({required:false}),
        paterno: Fields.THIS({required:false}),
        materno: Fields.THIS({required:false}),
        ci: Fields.THIS({required:false})
      }
    }
  })

  resource.addRoute('GET', `/`, {
    title: 'listarAdministrativos',
    output: [resource.output],
    controller: (req) => {
      let options = req.options
      return db.administrativo.findAll(options)
    }
  })

  resource.addRoute('GET', `/mi`, {
    title: 'obtenerDatosUsuarioActual',
    output: {
      id: Fields.THIS({required:false}),
      cargo: Fields.THIS({required:false}),
      id_persona: Fields.THIS({required:false}),
      persona: {
        id: Fields.THIS({required:false}),
        nombre: Fields.THIS({required:false}),
        paterno: Fields.THIS({required:false}),
        materno: Fields.THIS({required:false}),
        ci: Fields.THIS({required:false}),
        email: Fields.THIS({required:false}),
        direccion: Fields.THIS({required:false}),
        telefono: Fields.THIS({required:false}),
        id_usuario: Fields.THIS({required:false}),
        usuario: {
          id: Fields.THIS({required:false}),
          username: Fields.THIS({required:false}),
          password: Fields.THIS({required:false}),
          nombre: Fields.THIS({required:false}),
          email: Fields.THIS({required:false})
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
        id: Fields.THIS({required:true})
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
    description: `El nombre de usuario por defecto es su carnet de identidad <code>ci</code> y el password por defecto es su nro de item <code>item</code>.`,
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
        id: Fields.THIS({required:true})
      },
      body: {
        cargo: Fields.THIS({required:false}),
        persona: {
          nombre: Fields.THIS({required:false}),
          paterno: Fields.THIS({required:false}),
          materno: Fields.THIS({required:false}),
          ci: Fields.THIS({required:false}),
          email: Fields.THIS({required:false}),
          direccion: Fields.THIS({required:false}),
          telefono: Fields.THIS({required:false})
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
        id: Fields.THIS({required:true})
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
