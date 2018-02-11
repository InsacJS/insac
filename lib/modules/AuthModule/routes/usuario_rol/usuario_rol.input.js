const { THIS } = require('insac-field')

module.exports = (app) => {
  const INPUT = {}

  INPUT.listar = {}

  INPUT.obtener = {
    params: {
      id_usuario_rol: THIS({ allowNull: false })
    }
  }

  INPUT.crear = {
    body: {
      estado: THIS({ allowNull: false }),
      fid_usuario: THIS({ allowNull: false }),
      fid_rol: THIS({ allowNull: false })
    }
  }

  INPUT.actualizar = {
    params: {
      id_usuario_rol: THIS({ allowNull: false })
    },
    body: {
      estado: THIS({ allowNull: true }),
      fid_usuario: THIS({ allowNull: false }),
      fid_rol: THIS({ allowNull: false })
    }
  }

  INPUT.eliminar = {
    params: {
      id_usuario_rol: THIS({ allowNull: false })
    }
  }

  return INPUT
}
