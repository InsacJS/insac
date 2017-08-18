'use strict'

module.exports = (insac, models, Field, Data, Validator, Util) => {

  let routes = []

  routes.push(insac.createRoute('GET', '/api/v1/personas', {
    roles: ['est','doc'],
    model: models.persona,
    input: {
      headers: {
        authorization: Field.AUTHORIZATION
      }
    },
    output: {
      metadata: {
        count: Field.META_COUNT,
        total: Field.META_TOTAL,
        limit: Field.META_LIMIT,
        offset: Field.META_OFFSET
      },
      data: [{
        id: models.persona.fields.id,
        nombre: models.persona.fields.nombre,
        direccion: models.persona.fields.direccion,
        ci: models.persona.fields.ci,
        _fecha_creacion: Field.CREATED_AT,
        _fecha_modificacion: Field.UPDATED_AT
      }]
    },
    middlewares: ['authorization'],
    controller: (req, res, opt, next) => {
      let options = Util.optionsQUERY(req, opt)
      models.persona.seq.findAll(options).then((result) => {
        models.persona.seq.count().then(count => {
          let data = Util.output(req, opt, result)
          let metadata = {
            count: data.length,
            total: count,
            limit: options.limit,
            offset: options.offset
          }
          res.success200(data, metadata)
        })
      }).catch(function (err) {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('GET', '/api/v1/personas/:id', {
    model: models.persona,
    input: {
      params: {
        id: models.persona.fields.id
      }
    },
    output: {
      data: {
        id: models.persona.fields.id,
        nombre: models.persona.fields.nombre,
        direccion: models.persona.fields.direccion,
        ci: models.persona.fields.ci,
        _fecha_creacion: Field.CREATED_AT,
        _fecha_modificacion: Field.UPDATED_AT,
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsID(req, opt)
      models.persona.seq.findOne(options).then((result) => {
        if (result) {
          let data = Util.output(req, opt, result)
          return res.success200(data)
        }
        let msg = `No existe el registro '${opt.model.name}' con el campo (id)=(${opt.input.params.id})`
        res.error404(msg)
      }).catch(function (err) {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('POST', '/api/v1/personas', {
    model: models.persona,
    input: {
      body: {
        nombre: models.persona.fields.nombre,
        direccion: models.persona.fields.direccion,
        ci: models.persona.fields.ci
      }
    },
    controller: (req, res, opt, next) => {
      let data = opt.input.body
      models.persona.seq.create(data).then((result) => {
        res.success201(result)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('POST', '/api/v2/personas', {
    model: models.persona,
    input: {
      body: [{
        nombre: models.persona.fields.nombre,
        direccion: models.persona.fields.direccion,
        ci: models.persona.fields.ci
      }]
    },
    controller: (req, res, opt, next) => {
      let data = opt.input.body
      models.persona.seq.bulkCreate(data).then((result) => {
        res.success201()
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('PUT', '/api/v1/personas/:id', {
    model: models.persona,
    input: {
      params: {
        id: models.persona.fields.id
      },
      body: {
        nombre: models.persona.fields.nombre,
        direccion: models.persona.fields.direccion,
        ci: models.persona.fields.ci
      }
    },
    controller: (req, res, opt, next) => {
      let data = opt.input.body
      let options = Util.optionsID(req, opt)
      models.persona.seq.update(data, options).then((result) => {
        let nroRowAffecteds = result[0];
        if (nroRowAffecteds > 0) {
          return res.success200()
        }
        let msg = `No existe el registro '${opt.model.name}' con el campo (id)=(${opt.input.params.id})`
        res.error404(msg)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('DELETE', '/api/v1/personas/:id', {
    model: models.persona,
    input: {
      params: {
        id: models.persona.fields.id
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsID(req, opt)
      models.persona.seq.destroy(options).then((result) => {
        if (result > 0) {
          return res.success200()
        }
        let msg = `No existe el registro '${opt.model.name}' con el campo (id)=(${opt.input.params.id})`
        res.error404(msg)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  return routes

}
