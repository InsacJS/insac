'use strict'

module.exports = (insac, models, Field, Data, Validator, Util) => {

  let routes = []

  routes.push(insac.createRoute('GET', '/api/v1/personas', {
    model: models.persona,
    output: {
      isArray: true,
      metadata: true,
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
      let options = Util.optionsQUERY(req, opt)
      models.persona.seq.findAndCountAll(options).then((result) => {
        let data = Util.output(req, opt, result.rows)
        let metadata = Util.metadata(data.length, result.count, options)
        res.success200(data, metadata)
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
        res.error404(opt.model.name, 'id', opt.input.params.id)
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
      let persona = opt.input.body
      models.persona.seq.create(persona).then((result) => {
        res.success201(result)
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
      let persona = opt.input.body
      let options = Util.optionsID(req, opt)
      models.persona.seq.update(persona, options).then((result) => {
        let nroRowAffecteds = result[0];
        if (nroRowAffecteds > 0) {
          return res.success200()
        }
        res.error404(opt.model.name, 'id', opt.input.params.id)
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
        res.error404(opt.model.name, 'id', opt.input.params.id)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  return routes

}
