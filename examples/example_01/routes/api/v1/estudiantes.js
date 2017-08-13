'use strict'

module.exports = (insac, models, Field, Data, Validator, Util) => {

  let routes = []

  routes.push(insac.createRoute('GET', '/api/v1/estudiantes', {
    model: models.estudiante,
    output: {
      isArray: true,
      metadata: true,
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
      let options = Util.optionsQUERY(req, opt)
      models.estudiante.seq.findAndCountAll(options).then((result) => {
        let metadata = Util.metadata(result, options)
        let data = Util.output(req, opt, result.rows)
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
        let msg = `No existe el registro '${opt.model.name}' con el campo (id)=(${req.params.id})`
        res.error422(msg)
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
        let msg = `No existe el registro '${opt.model.name}' con el campo (id)=(${req.params.id})`
        res.error422(msg)
      }).catch((err) => {
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
        let msg = `No existe el registro '${opt.model.name}' con el campo (id)=(${req.params.id})`
        res.error422(msg)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  return routes

}
