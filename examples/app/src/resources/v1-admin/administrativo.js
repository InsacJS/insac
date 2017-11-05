'use strict'
const { Resource, Fields, ResponseErrors } = require(INSAC)
const { NotFoundError } = ResponseErrors

module.exports = (insac, models, db) => {

  let resource = new Resource('/api/v1/administrativos', {
    model: 'administrativo',
    version: 1,
    rol: 'admin',
    middlewares: ['adminMiddleware'],
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
      return db.administrativo.findAll(req.options)
    }
  })

  resource.addRoute('GET', `/mi`, {
    title: 'obtenerDatosUsuarioActual',
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
        usuario: {
          id: Fields.THIS(),
          username: Fields.THIS(),
          password: Fields.THIS(),
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
        async function task() {
          let persona = req.body.persona
          let personaR = await db.persona.create(persona, {transaction:t})
          let administrativo = {
            cargo: req.body.cargo,
            id_persona: personaR.id
          }
          await db.administrativo.create(administrativo, {transaction:t})
          let usuario = {
            username: req.body.persona.ci,
            password: req.body.persona.ci,
            email: req.body.persona.email,
            id_persona: personaR.id
          }
          let usuarioR = await db.usuario.create(usuario, {transaction:t})
          let options = req.options
          options.where = { id:usuarioR.id }
          return db.administrativo.findOne(options)
        }
        return task()
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
        return async function task() {
          let administrativoOptions = {where: {id:req.params.id}, include:[
            {model:db.persona, as:'persona'}
          ]}
          let administrativoR = await db.administrativo.findOne(administrativoOptions)
          if (!administrativoR) {
            throw new NotFoundError()
          }
          let persona = req.body.persona
          await db.persona.update(persona, {where:{id:administrativoR.id_persona}}, {transaction:t})
          let administrativo = { }
          if (req.body && req.body.cargo) administrativo.cargo = req.body.cargo
          await db.administrativo.update(administrativo, {transaction:t})
          administrativoOptions = req.options
          administrativoOptions.id = req.params.id
          return db.administrativo.findOne(administrativoOptions)
        }
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
          return administrativoR
        })
      })
    }
  })

  return resource

}
