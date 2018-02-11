const { ResourceModule } = require(global.INSAC)

module.exports = (app, CONFIG) => {
  const MODEL = app.FIELD.models

  const INPUT = {}

  INPUT.listar = {
    headers: { authorization: MODEL.auth('authorization') },
    query: {
      fields: MODEL.query('fields'),
      order: MODEL.query('order'),
      limit: MODEL.query('limit'),
      page: MODEL.query('page')
    }
  }

  INPUT.obtener = {
    headers: { authorization: MODEL.auth('authorization') },
    query: {
      fields: MODEL.query('fields')
    }
  }

  INPUT.crear = {
    headers: { authorization: MODEL.auth('authorization') }
  }

  INPUT.actualizar = {
    headers: { authorization: MODEL.auth('authorization') }
  }

  INPUT.eliminar = {
    headers: { authorization: MODEL.auth('authorization') }
  }

  CONFIG.input = INPUT

  return new ResourceModule(app, CONFIG)
}
