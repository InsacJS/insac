module.exports = (app) => {
  const FIELD = app.FIELD.models
  const INPUT = {}

  INPUT.listar = {}

  INPUT.obtener = {
    params: {
      id: FIELD.usuario_rol('id_usuario_rol', { allowNull: false })
    }
  }

  INPUT.crear = {
    body: {
      estado: FIELD.usuario_rol('estado', { allowNull: false }),
      fid_usuario: FIELD.usuario_rol('fid_usuario', { allowNull: false }),
      fid_rol: FIELD.usuario_rol('fid_rol', { allowNull: false })
    }
  }

  INPUT.actualizar = {
    params: {
      id: FIELD.usuario_rol('id_usuario_rol', { allowNull: false })
    },
    body: {
      estado: FIELD.usuario_rol('estado', { allowNull: true }),
      fid_usuario: FIELD.usuario_rol('fid_usuario', { allowNull: false }),
      fid_rol: FIELD.usuario_rol('fid_rol', { allowNull: false })
    }
  }

  INPUT.eliminar = {
    params: {
      id: FIELD.usuario_rol('id_usuario_rol', { allowNull: false })
    }
  }

  return INPUT
}
