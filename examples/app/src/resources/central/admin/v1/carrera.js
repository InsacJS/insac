'use strict'
const { Resource, Fields } = require(INSAC)
const { NotFoundError } = require(INSAC).ResponseErrors

module.exports = (insac, models, db) => {

  let resource = new Resource('carrera', '/api/v1/carreras', {
    model: models.carrera,
    version: 1,
    rol: 'admin',
    middlewares: [ { name: 'auth', args: { rol:'admin' } } ],
    output: {
      id: Fields.THIS({allowNull:true}),
      nombre: Fields.THIS({allowNull:true})
    }
  })

  resource.addRoute('GET', `/`, {
    title: 'listarCarreras',
    output: [resource.output],
    controller: (req) => {
      let options = req.options
      return db.carrera.findAll(options)
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
      return db.carrera.findOne(options).then(carreraR => {
        if (!carreraR) {
          throw new NotFoundError()
        }
        return carreraR
      })
    }
  })

  resource.addRoute('POST', `/`, {
    input: {
      body: {
        nombre: Fields.THIS()
      }
    },
    controller: (req) => {
      return db.carrera.create(req.body).then(result => {
        let options = req.options
        options.where = { id:result.id }
        return db.carrera.findOne(options)
      })
    }
  })

  resource.addRoute('PUT', `/:id`, {
    input: {
      params: {
        id: Fields.THIS({allowNull:false})
      },
      body: {
        nombre: Fields.THIS({allowNull:true})
      }
    },
    controller: (req) => {
      let options = req.options
      options.where = { id:result.id }
      return db.carrera.update(req.body, options).then(result => {
        return db.carrera.findOne(options)
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
      options.where = { id:result.id }
      return db.carrera.findOne(options).then(carreraR => {
        if (!carreraR) {
          throw new NotFoundError(`No existe el recurso`)
        }
        return db.carrera.destroy(options).then(result => {
          return carreraR
        })
      })
    }
  })

  return resource

}
