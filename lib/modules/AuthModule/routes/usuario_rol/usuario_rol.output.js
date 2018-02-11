module.exports = (app) => {
  const FIELD = app.FIELD.models
  const OUTPUT = {}

  OUTPUT.listar = [{
    id_usuario_rol: FIELD.usuario_rol('id_usuario_rol'),
    estado: FIELD.usuario_rol('estado'),
    fid_usuario: FIELD.usuario_rol('fid_usuario'),
    fid_rol: FIELD.usuario_rol('fid_rol'),
    _fecha_creacion: FIELD.usuario_rol('_fecha_creacion'),
    _fecha_modificacion: FIELD.usuario_rol('_fecha_modificacion'),
    usuario: {
      id_usuario: FIELD.usuario('id_usuario'),
      username: FIELD.usuario('username'),
      password: FIELD.usuario('password')
    },
    rol: {
      id_rol: FIELD.rol('id_rol'),
      codigo: FIELD.rol('codigo'),
      nombre: FIELD.rol('nombre')
    }
  }]

  OUTPUT.obtener = OUTPUT.listar[0]

  OUTPUT.crear = {
    id_usuario_rol: FIELD.usuario_rol('id_usuario_rol'),
    estado: FIELD.usuario_rol('estado'),
    fid_usuario: FIELD.usuario_rol('fid_usuario'),
    fid_rol: FIELD.usuario_rol('fid_usuario'),
    _fecha_creacion: FIELD.usuario_rol('_fecha_creacion'),
    _fecha_modificacion: FIELD.usuario_rol('_fecha_modificacion')
  }

  OUTPUT.actualizar = {}

  OUTPUT.eliminar = {}

  return OUTPUT
}
