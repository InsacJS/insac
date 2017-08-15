'use strict'

module.exports = (insac, models, Field, Data, Validator, Util) => {

  let routes = []

  routes.push(insac.createRoute('GET', '/api/v1/materias', {
    model: models.materia,
    output: {
      metadata: {
        count: new Field({type:Data.INTEGER, description:'Cantidad de registros devueltos'}),
        total: new Field({type:Data.INTEGER, description:'Cantidad de registros existentes'}),
        limit: new Field({type:Data.INTEGER, description:'Cantidad máxima de registros a devolver'}),
        offset: new Field({type:Data.INTEGER, description:'Posición inicial de registros a devolver'})
      },
      data: [{
        id: models.materia.fields.id,
        nombre: models.materia.fields.nombre,
        sigla: models.materia.fields.sigla,
        _fecha_creacion: Field.CREATED_AT,
        _fecha_modificacion: Field.UPDATED_AT
      }]
    },
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
        res.error404(opt.model.name, 'id', opt.input.params.id)
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
        res.error404(opt.model.name, 'id', opt.input.params.id)
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
        res.error404(opt.model.name, 'id', opt.input.params.id)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  return routes

}
