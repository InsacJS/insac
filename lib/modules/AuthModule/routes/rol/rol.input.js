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
      nombre: THIS({ allowNull: false }),
      descripcion: THIS({ allowNull: false })
    }
  }

  INPUT.actualizar = {
    params: {
      id_rol: THIS({ allowNull: false })
    },
    body: {
      nombre: THIS({ allowNull: true }),
      descripcion: THIS({ allowNull: true })
    }
  }

  INPUT.eliminar = {
    params: {
      id_rol: THIS({ allowNull: false })
    }
  }

  return INPUT
}
