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
        persona: {
          id: models.persona.fields.id,
          nombre: models.persona.fields.nombre,
          ci: models.persona.fields.ci
        }
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.getOptionsQUERY(opt, req)
      models.estudiante.seq.findAndCountAll(options).then((result) => {
        let metadata = Util.getMetadata(result, options)
        let data = Util.getData(opt, result.rows)
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
        persona: {
          id: models.persona.fields.id,
          nombre: models.persona.fields.nombre,
          ci: models.persona.fields.ci
        }
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.getOptionsID(opt, req)
      models.estudiante.seq.findOne(options).then((result) => {
        let data = Util.createData(opt, result)
        res.success200(data)
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
        id_persona: models.estudiante.fields.id_persona,
      }
    },
    controller: (req, res, opt, next) => {
      let data = opt.input.body
      models.estudiante.seq.create(data).then((result) => {
        res.success200(result)
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
      let options = Util.getOptionsID(opt, req)
      models.estudiante.seq.update(data, options).then((result) => {
        res.success200()
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
      let options = Util.getOptionsID(opt, req)
      models.estudiante.seq.destroy(options).then((result) => {
        if (result > 0) {
          return res.success200()
        }
        let msg = `No existe el registro '${opt.model.name}' con '${opt.model.fields.id.name}' igual a '${opt.input.params.id}'`
        res.error422(msg)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  return routes

}
