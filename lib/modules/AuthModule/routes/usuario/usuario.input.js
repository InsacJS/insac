const { THIS } = require('insac-field')

module.exports = (app) => {
  const INPUT = {}

  INPUT.listar = {}

  INPUT.obtener = {
    params: {
      id_usuario: THIS({ allowNull: false })
    }
  }

  INPUT.crear = {
    body: {
      username: THIS({ allowNull: false }),
      password: THIS({ allowNull: false })
    }
  }

  INPUT.actualizar = {
    params: {
      id_usuario: THIS({ allowNull: false })
    },
    body: {
      username: THIS({ allowNull: true }),
      password: THIS({ allowNull: true })
    }
  }

  INPUT.eliminar = {
    params: {
      id_usuario: THIS({ allowNull: false })
    }
  }

  return INPUT
}
