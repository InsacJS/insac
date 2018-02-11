module.exports = (app) => {
  const MODEL = app.FIELD.models
  const INPUT = {}

  INPUT.listar = {}

  INPUT.obtener = {
    params: {
      id: MODEL.rol('id_rol', { allowNull: false })
    }
  }

  INPUT.crear = {
    body: {
      codigo: MODEL.rol('codigo', { allowNull: false }),
      nombre: MODEL.rol('nombre', { allowNull: false })
    }
  }

  INPUT.actualizar = {
    params: {
      id: MODEL.rol('id_rol', { allowNull: false })
    },
    body: {
      codigo: MODEL.rol('codigo', { allowNull: true }),
      nombre: MODEL.rol('nombre', { allowNull: true })
    }
  }

  INPUT.eliminar = {
    params: {
      id: MODEL.rol('id_rol', { allowNull: false })
    }
  }

  return INPUT
}
