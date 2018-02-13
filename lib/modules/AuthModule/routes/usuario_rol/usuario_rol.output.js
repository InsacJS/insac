const { THIS } = require('insac-field')

module.exports = (app) => {
  const OUTPUT = {}

  OUTPUT.listar = [{
    id_usuario_rol: THIS(),
    estado: THIS(),
    fid_usuario: THIS(),
    fid_rol: THIS(),
    _fecha_creacion: THIS(),
    _fecha_modificacion: THIS(),
    usuario: {
      id_usuario: THIS(),
      username: THIS(),
      password: THIS()
    },
    rol: {
      id_rol: THIS(),
      nombre: THIS(),
      descripcion: THIS()
    }
  }]

  OUTPUT.obtener = OUTPUT.listar[0]

  OUTPUT.crear = {
    id_usuario_rol: THIS(),
    estado: THIS(),
    fid_usuario: THIS(),
    fid_rol: THIS(),
    _fecha_creacion: THIS(),
    _fecha_modificacion: THIS()
  }

  OUTPUT.actualizar = {}

  OUTPUT.eliminar = {}

  return OUTPUT
}
