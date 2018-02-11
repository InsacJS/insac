module.exports = (app) => {
  const MODEL = app.FIELD.models
  const INPUT = {}

  INPUT.listar = {}

  INPUT.obtener = {
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
