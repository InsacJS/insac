const { THIS } = require('insac-field')

module.exports = (app) => {
  const INPUT = {}

  INPUT.listar = {}

  INPUT.obtener = {
    params: {
      id_rol: THIS({ allowNull: false })
    }
  }

  INPUT.crear = {
    body: {
      codigo: THIS({ allowNull: false }),
      nombre: THIS({ allowNull: false })
    }
  }

  INPUT.actualizar = {
    params: {
      id_rol: THIS({ allowNull: false })
    },
    body: {
      codigo: THIS({ allowNull: true }),
      nombre: THIS({ allowNull: true })
    }
  }

  INPUT.eliminar = {
    params: {
      id_rol: THIS({ allowNull: false })
    }
  }

  return INPUT
}
