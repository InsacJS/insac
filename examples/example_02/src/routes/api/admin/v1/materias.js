'use strict'

module.exports = (insac, models, Field, Data, Validator, Util) => {

  let routes = []

  routes.push(insac.createRoute('GET', '/api/v1/materias', {
    roles: ['est'],
    model: models.materia,
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
        id: models.materia.fields.id,
        nombre: models.materia.fields.nombre,
        sigla: models.materia.fields.sigla,
        _fecha_creacion: Field.CREATED_AT,
        _fecha_modificacion: Field.UPDATED_AT
      }]
    },
    middlewares: ['authorization'],
    controller: (req, res, opt, next) => {
      let options = Util.optionsQUERY(req, opt)
      models.materia.seq.findAll(options).then((result) => {
        models.materia.seq.count().then(count => {
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

  routes.push(insac.createRoute('GET', '/api/v1/materias/:id', {
    model: models.materia,
    input: {
      params: {
        id: models.materia.fields.id
      }
    },
    output: {
      data: {
        id: models.materia.fields.id,
        nombre: models.materia.fields.nombre,
        sigla: models.materia.fields.sigla,
        _fecha_creacion: Field.CREATED_AT,
        _fecha_modificacion: Field.UPDATED_AT
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsID(req, opt)
      models.materia.seq.findOne(options).then((result) => {
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

  routes.push(insac.createRoute('POST', '/api/v1/materias', {
    model: models.materia,
    input: {
      body: {
        nombre: models.materia.fields.nombre,
        sigla: models.materia.fields.sigla
      }
    },
    controller: (req, res, opt, next) => {
      let data = opt.input.body
      models.materia.seq.create(data).then((result) => {
        res.success201(result)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('POST', '/api/v2/materias', {
    model: models.materia,
    input: {
      body: [{
        nombre: models.materia.fields.nombre,
        sigla: models.materia.fields.sigla
      }]
    },
    controller: (req, res, opt, next) => {
      let data = opt.input.body
      models.materia.seq.bulkCreate(data).then((result) => {
        res.success201()
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('PUT', '/api/v1/materias/:id', {
    model: models.materia,
    input: {
      params: {
        id: models.materia.fields.id
      },
      body: {
        nombre: models.materia.fields.nombre,
        sigla: models.materia.fields.sigla
      }
    },
    controller: (req, res, opt, next) => {
      let data = opt.input.body
      let options = Util.optionsID(req, opt)
      models.materia.seq.update(data, options).then((result) => {
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

  routes.push(insac.createRoute('DELETE', '/api/v1/materias/:id', {
    model: models.materia,
    input: {
      params: {
        id: models.materia.fields.id
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsID(req, opt)
      models.materia.seq.destroy(options).then((result) => {
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
