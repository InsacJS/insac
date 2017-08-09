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
        ci: models.persona.fields.ci
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.getOptionsQUERY(opt, req)
      models.persona.seq.findAndCountAll(options).then((result) => {
        let metadata = Util.getMetadata(result, options)
        let data = Util.getData(opt, result.rows)
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
        ci: models.persona.fields.ci
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.getOptionsID(opt, req)
      models.persona.seq.findOne(options).then((result) => {
        let data = Util.createData(opt, result)
        res.success200(data)
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
        ci: models.persona.fields.ci,
      }
    },
    controller: (req, res, opt, next) => {
      let persona = opt.input.body
      models.persona.seq.create(persona).then((result) => {
        res.success200(result)
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
      let options = Util.getOptionsID(opt, req)
      models.persona.seq.update(persona, options).then((result) => {
        res.success200()
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
      let options = Util.getOptionsID(opt, req)
      models.persona.seq.destroy(options).then((result) => {
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
