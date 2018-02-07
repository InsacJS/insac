const { Field } = require(global.INSAC)

module.exports = (app) => {
  const MODEL = app.FIELD.models
  const INPUT = {}

  INPUT.listar = {
    query: {
      fields: Field.FIELDS(),
      order: Field.ORDER(),
      limit: Field.LIMIT(),
      page: Field.PAGE()
    }
  }

  INPUT.obtener = {
    query: {
      fields: Field.FIELDS()
    },
    params: {
      id: MODEL.curso('id_curso', { allowNull: false })
    }
  }

  INPUT.crear = {
    body: {
      nombre: MODEL.curso('nombre', { allowNull: false }),
      categoria: MODEL.curso('categoria', { allowNull: false })
    }
  }

  INPUT.actualizar = {
    params: {
      id: MODEL.curso('id_curso', { allowNull: false })
    },
    body: {
      nombre: MODEL.curso('nombre', { allowNull: true }),
      categoria: MODEL.curso('categoria', { allowNull: true })
    }
  }

  INPUT.eliminar = {
    params: {
      id: MODEL.curso('id_curso', { allowNull: false })
    }
  }

  return INPUT
}
