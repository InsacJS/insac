'use strict'

module.exports = (insac, models, Field, Data, Validator, Util) => {

  let routes = []

  routes.push(insac.createRoute('GET', '/api/v1/inscripciones', {
    model: models.inscripcion,
    output: {
      metadata: true,
      data: [{
        id: models.inscripcion.fields.id,
        gestion: models.inscripcion.fields.gestion,
        id_estudiante: models.inscripcion.fields.id_estudiante,
        id_materia: models.inscripcion.fields.id_materia,
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
        },
        materia: {
          id: models.materia.fields.id,
          nombre: models.materia.fields.nombre,
          sigla: models.materia.fields.sigla,
          _fecha_creacion: Field.CREATED_AT,
          _fecha_modificacion: Field.UPDATED_AT
        }
      }]
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsQUERY(req, opt)
      models.inscripcion.seq.findAndCountAll(options).then((result) => {
        let data = Util.output(req, opt, result.rows)
        let metadata = Util.metadata(data.length, result.count, options)
        res.success200(data, metadata)
      }).catch(function (err) {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('GET', '/api/v1/inscripciones/:id', {
    model: models.inscripcion,
    input: {
      params: {
        id: models.inscripcion.fields.id
      }
    },
    output: {
      data: {
        id: models.inscripcion.fields.id,
        gestion: models.inscripcion.fields.gestion,
        id_estudiante: models.inscripcion.fields.id_estudiante,
        id_materia: models.inscripcion.fields.id_materia,
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
        },
        materia: {
          id: models.materia.fields.id,
          nombre: models.materia.fields.nombre,
          sigla: models.materia.fields.sigla,
          _fecha_creacion: Field.CREATED_AT,
          _fecha_modificacion: Field.UPDATED_AT
        }
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsID(req, opt)
      models.inscripcion.seq.findOne(options).then((result) => {
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

  routes.push(insac.createRoute('POST', '/api/v1/inscripciones', {
    model: models.inscripcion,
    input: {
      body: {
        gestion: models.inscripcion.fields.gestion,
        id_estudiante: models.inscripcion.fields.id_estudiante,
        id_materia: models.inscripcion.fields.id_materia
      }
    },
    controller: (req, res, opt, next) => {
      let data = opt.input.body
      console.log("DATA: ", data)
      models.inscripcion.seq.create(data).then((result) => {
        res.success201(result)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('PUT', '/api/v1/inscripciones/:id', {
    model: models.inscripcion,
    input: {
      params: {
        id: models.inscripcion.fields.id
      },
      body: {
        gestion: models.inscripcion.fields.gestion,
        id_estudiante: models.inscripcion.fields.id_estudiante,
        id_materia: models.inscripcion.fields.id_materia
      }
    },
    controller: (req, res, opt, next) => {
      let data = opt.input.body
      let options = Util.optionsID(req, opt)
      models.inscripcion.seq.update(data, options).then((result) => {
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

  routes.push(insac.createRoute('DELETE', '/api/v1/inscripciones/:id', {
    model: models.inscripcion,
    input: {
      params: {
        id: models.inscripcion.fields.id
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsID(req, opt)
      models.inscripcion.seq.destroy(options).then((result) => {
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
