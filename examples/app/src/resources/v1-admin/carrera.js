'use strict'
const { Resource, Fields } = require(INSAC)
const { NotFoundError } = require(INSAC).ResponseErrors

module.exports = (insac, models, db) => {

  let resource = new Resource('/api/v1/carreras', {
    model: models.carrera,
    version: 1,
    rol: 'admin',
    middlewares: ['adminMiddleware'],
    output: {
      id: Fields.THIS(),
      nombre: Fields.THIS()
    }
  })

  resource.addRoute('GET', `/`, {
    output: [resource.output],
    controller: (req) => {
      let options = req.options
      return db.carrera.findAll(options)
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
        id: Fields.THIS({required:true})
      },
      body: {
        nombre: Fields.THIS({required:false})
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
        id: Fields.THIS({required:true})
      }
    },
    controller: (req) => {
      let options = req.options
      options.where = { id:result.id }
      return db.carrera.findOne(options).then(carreraR => {
        if (!carreraR) {
          throw new NotFoundError()
        }
        return db.carrera.destroy(options).then(result => {
          return carreraR
        })
      })
    }
  })

  return resource

}
