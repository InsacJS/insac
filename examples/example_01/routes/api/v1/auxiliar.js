'use strict'

module.exports = (insac, models, Field, Data, Validator, Util) => {

  let routes = []

  routes.push(insac.createRoute('GET', '/api/v1/auxiliares', {
    model: models.auxiliar,
    output: {
      isArray: true,
      metadata: true,
      data: {
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
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsQUERY(req, opt)
      models.auxiliar.seq.findAndCountAll(options).then((result) => {
        let metadata = Util.metadata(result, options)
        let data = Util.output(req, opt, result.rows)
        res.success200(data, metadata)
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
        _fecha_creacion: models.auxiliar.fields._fecha_creacion,
        _fecha_modificacion: models.auxiliar.fields._fecha_modificacion,
        estudiante: {
          id: models.estudiante.fields.id,
          ru: models.estudiante.fields.ru,
          id_persona: models.estudiante.fields.id_persona,
          _fecha_creacion: models.estudiante.fields._fecha_creacion,
          _fecha_modificacion: models.estudiante.fields._fecha_modificacion,
          persona: {
            id: models.persona.fields.id,
            nombre: models.persona.fields.nombre,
            dirección: models.persona.fields.dirección,
            ci: models.persona.fields.ci,
            _fecha_creacion: models.persona.fields._fecha_creacion,
            _fecha_modificacion: models.persona.fields._fecha_modificacion
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
        let msg = `No existe el registro '${opt.model.name}' con el campo (id)=(${req.params.id})`
        res.error422(msg)
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
        let msg = `No existe el registro '${opt.model.name}' con el campo (id)=(${req.params.id})`
        res.error422(msg)
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
        let msg = `No existe el registro '${opt.model.name}' con el campo (id)=(${req.params.id})`
        res.error422(msg)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  return routes

}
