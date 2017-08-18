'use strict'

module.exports = (insac, models, Field, DataType, Validator, Util) => {

  let routes = []

  routes.push(insac.createRoute('GET', '/api/admin/v1/auxiliares', {
    version: 1,
    model: models.auxiliar,
    output: {
      metadata: {
        count: Field.META_COUNT,
        total: Field.META_TOTAL,
        limit: Field.META_LIMIT,
        offset: Field.META_OFFSET
      },
      data: [{
        id: models.auxiliar.fields.id,
        especialidad: models.auxiliar.fields.especialidad,
        id_estudiante: models.auxiliar.fields.id_estudiante,
        _fecha_creacion: Field.CREATED_AT,
        _fecha_modificacion: Field.UPDATED_AT,
        estudiante: {
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
            _fecha_modificacion: Field.UPDATED_AT
          }
        }
      }]
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsQUERY(req, opt)
      models.auxiliar.seq.findAll(options).then((result) => {
        models.auxiliar.seq.count().then(count => {
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

  routes.push(insac.createRoute('GET', '/api/v1/auxiliares/:id', {
    model: models.auxiliar,
    input: {
      params: {
        id: models.auxiliar.fields.id
      }
    },
    output: {
      data: {
        id: models.auxiliar.fields.id,
        especialidad: models.auxiliar.fields.especialidad,
        id_estudiante: models.auxiliar.id_estudiante,
        _fecha_creacion: Field.CREATED_AT,
        _fecha_modificacion: Field.UPDATED_AT,
        estudiante: {
          id: models.estudiante.fields.id,
          ru: models.estudiante.fields.ru,
          id_persona: models.estudiante.fields.id_persona,
          _fecha_creacion: Field.CREATED_AT,
          _fecha_modificacion: Field.UPDATED_AT,
          persona: {
            id: models.persona.fields.id,
            nombre: models.persona.fields.nombre,
            dirección: models.persona.fields.dirección,
            ci: models.persona.fields.ci,
            _fecha_creacion: Field.CREATED_AT,
            _fecha_modificacion: Field.UPDATED_AT
          }
        }
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsID(req, opt)
      models.auxiliar.seq.findOne(options).then((result) => {
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

  routes.push(insac.createRoute('POST', '/api/v1/auxiliares', {
    model: models.auxiliar,
    input: {
      body: {
        especialidad: models.auxiliar.fields.especialidad,
        id_estudiante: models.auxiliar.fields.id_estudiante
      }
    },
    controller: (req, res, opt, next) => {
      let data = opt.input.body
      models.auxiliar.seq.create(data).then((result) => {
        res.success201(result)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('POST', '/api/v2/auxiliares', {
    model: models.auxiliar,
    input: {
      body: {
        especialidad: models.auxiliar.fields.especialidad,
        estudiante: {
          persona: {
            ci: models.persona.fields.ci
          }
        }
      }
    },
    controller: (req, res, opt, next) => {
      let options = {include:[{model:models.persona.seq,where:{ci:opt.input.body.estudiante.persona.ci}}]}
      models.estudiante.seq.findOne(options).then(estudianteR => {
        if (estudianteR) {
          let data = {
            especialidad: opt.input.body.especialidad,
            id_estudiante: estudianteR.id
          }
          models.auxiliar.seq.create(data).then((result) => {
            res.success201(result)
          }).catch((err) => {
            if (err.name == 'SequelizeForeignKeyConstraintError') {
              let msg = `Ya existe un registro 'auxiliar' con el campo '(estudiante.persona.ci)=(${opt.input.body.estudiante.persona.ci})' y debe ser único`
              return res.error422(msg)
            }
            res.error(err)
          })
        } else {
          res.error404('estudiante', 'persona.ci', opt.input.body.estudiante.persona.ci)
        }
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('PUT', '/api/v1/auxiliares/:id', {
    model: models.auxiliar,
    input: {
      params: {
        id: models.auxiliar.fields.id
      },
      body: {
        especialidad: models.auxiliar.fields.especialidad,
        id_estudiante: models.auxiliar.fields.id_estudiante
      }
    },
    controller: (req, res, opt, next) => {
      let data = opt.input.body
      let options = Util.optionsID(req, opt)
      models.auxiliar.seq.update(data, options).then((result) => {
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

  routes.push(insac.createRoute('DELETE', '/api/v1/auxiliares/:id', {
    model: models.auxiliar,
    input: {
      params: {
        id: models.auxiliar.fields.id
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsID(req, opt)
      models.auxiliar.seq.destroy(options).then((result) => {
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
