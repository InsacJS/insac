const { THIS } = require('insac-field')

module.exports = (app) => {
  const MODEL = app.FIELD.models
  const INPUT = {}

  INPUT.listar = {}

  INPUT.obtener = {
    params: {
      id: MODEL.usuario('id_usuario', { allowNull: false })
    }
  }

  INPUT.crear = {
    body: app.FIELD.group('usuario', {
      username: THIS({ allowNull: false }),
      password: THIS({ allowNull: false })
    })
  }

  INPUT.actualizar = {
    params: {
      id: MODEL.usuario('id_usuario', { allowNull: false })
    },
    body: app.FIELD.group('usuario', {
      username: THIS({ allowNull: true }),
      password: THIS({ allowNull: true })
    })
  }

  INPUT.eliminar = {
    params: {
      id: MODEL.usuario('id_usuario', { allowNull: false })
    }
  }

  return INPUT
}
