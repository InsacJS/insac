'use strict'

module.exports = (insac, models, Field, Data, Validator, Util) => {

  let routes = []

  routes.push(insac.createRoute('GET', '/api/v1/estudiantes', {
    model: models.estudiante,
    output: {
      metadata: true,
      data: [{
        id: models.estudiante.fields.id,
        ru: models.estudiante.fields.ru,
        id_persona: models.estudiante.fields.id_persona,
        _fecha_creacion: Field.CREATED_AT,
        _fecha_modificacion: Field.UPDATED_AT,
        persona: {
          id: models.persona.fields.id,
          nombre: models.persona.fields.nombre,
          direccion: models.persona.fields.direccion,
          ci: models.persona.fields.ci,
          _fecha_creacion: Field.CREATED_AT,
          _fecha_modificacion: Field.UPDATED_AT,
        }
      }]
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsQUERY(req, opt)
      models.estudiante.seq.findAndCountAll(options).then((result) => {
        return res.success200(result)
        let data = Util.output(req, opt, result.rows)
        let metadata = Util.metadata(data.length, result.count, options)
        res.success200(data, metadata)
      }).catch(function (err) {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('GET', '/api/v1/estudiantes/:id', {
    model: models.estudiante,
    input: {
      params: {
        id: models.estudiante.fields.id
      }
    },
    output: {
      data: {
        id: models.estudiante.fields.id,
        ru: models.estudiante.fields.ru,
        id_persona: models.estudiante.fields.id_persona,
        _fecha_creacion: Field.CREATED_AT,
        _fecha_modificacion: Field.UPDATED_AT,
        persona: {
          id: models.persona.fields.id,
          nombre: models.persona.fields.nombre,
          direccion: models.persona.fields.direccion,
          ci: models.persona.fields.ci,
          _fecha_creacion: Field.CREATED_AT,
          _fecha_modificacion: Field.UPDATED_AT,
        }
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsID(req, opt)
      models.estudiante.seq.findOne(options).then((result) => {
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

  routes.push(insac.createRoute('POST', '/api/v1/estudiantes', {
    model: models.estudiante,
    input: {
      body: {
        ru: models.estudiante.fields.ru,
        id_persona: models.estudiante.fields.id_persona
      }
    },
    controller: (req, res, opt, next) => {
      let data = opt.input.body
      models.estudiante.seq.create(data).then((result) => {
        res.success201(result)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('POST', '/api/v2/estudiantes', {
    model: models.estudiante,
    input: {
      body: {
        ru: models.estudiante.fields.ru,
        persona: {
          nombre: models.persona.fields.nombre,
          direccion: models.persona.fields.direccion,
          ci: models.persona.fields.ci
        }
      }
    },
    controller: (req, res, opt, next) => {
      let persona = opt.input.body.persona
      insac.database.sequelize.transaction((t) => {
        return models.persona.seq.create(persona, {transaction:t}).then(personaR => {
          let data = {
            ru: opt.input.body.ru,
            id_persona: personaR.id
          }
          return models.estudiante.seq.create(data, {transaction:t})
        })
      }).then(result => {
        res.success201(result)
      }).catch(err => {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('PUT', '/api/v1/estudiantes/:id', {
    model: models.estudiante,
    input: {
      params: {
        id: models.estudiante.fields.id
      },
      body: {
        ru: models.estudiante.fields.ru,
        id_persona: models.estudiante.fields.id_persona
      }
    },
    controller: (req, res, opt, next) => {
      let data = opt.input.body
      let options = Util.optionsID(req, opt)
      models.estudiante.seq.update(data, options).then((result) => {
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

  routes.push(insac.createRoute('PUT', '/api/v2/estudiantes/:id', {
    model: models.estudiante,
    input: {
      params: {
        id: models.estudiante.fields.id
      },
      body: {
        ru: models.estudiante.fields.ru,
        persona: {
          nombre: models.persona.fields.nombre,
          direccion: models.persona.fields.direccion,
          ci: models.persona.fields.ci
        }
      }
    },
    controller: (req, res, opt, next) => {
      if (Util.isUndefined(opt.input.body)) {
        let msg = `Debe enviar al menos un campo válido`
        return res.error422(msg)
      }
      insac.database.sequelize.transaction(t => {
        let data = {}
        if (typeof opt.input.body.ru != 'undefined') data.ru = opt.input.body.ru
        let options = Util.optionsID(req, opt)
        return models.estudiante.seq.update(data, options, {transaction:t}).then((result) => {
          let nroRowAffecteds = result[0];
          if (nroRowAffecteds > 0) {
            return models.estudiante.seq.findOne(options).then((result) => {
              let persona = opt.input.body.persona
              let personaOptions = {where:{id:result.id_persona}}
              return models.persona.seq.update(persona, personaOptions, {transaction:t})
            })
          } else {
            throw {custom:true, resource:opt.model.name, field:'id', value:opt.input.params.id }
          }
        })
      }).then(result => {
        res.success200()
      }).catch(err => {
        if (err.custom) {
          return res.error404(err.resource, err.field, err.value)
        }
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('DELETE', '/api/v1/estudiantes/:id', {
    model: models.estudiante,
    input: {
      params: {
        id: models.estudiante.fields.id
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsID(req, opt)
      models.estudiante.seq.destroy(options).then((result) => {
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
