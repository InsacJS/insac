const { THIS } = require('insac-field')

module.exports = (app) => {
  const OUTPUT = {}

  OUTPUT.listar = app.FIELD.group('usuario', [{
    id_usuario: THIS(),
    username: THIS(),
    password: THIS(),
    _fecha_creacion: THIS(),
    _fecha_modificacion: THIS(),
    roles_usuario: [{
      id_usuario_rol: THIS(),
      estado: THIS(),
      fid_usuario: THIS(),
      fid_rol: THIS(),
      usuario: {
        id_usuario: THIS(),
        username: THIS(),
        password: THIS()
      },
      rol: {
        id_rol: THIS(),
        codigo: THIS(),
        nombre: THIS()
      }
    }]
  }])

  OUTPUT.obtener = OUTPUT.listar[0]

  OUTPUT.crear = app.FIELD.group('usuario', {
    id_usuario: THIS(),
    username: THIS(),
    password: THIS(),
    _fecha_creacion: THIS(),
    _fecha_modificacion: THIS()
  })

  OUTPUT.actualizar = {}

  OUTPUT.eliminar = {}

  return OUTPUT
}
