module.exports = (app) => {
  const MODEL = app.FIELD.models
  const OUTPUT = {}

  OUTPUT.listar = [{
    id_rol: MODEL.rol('id_rol'),
    codigo: MODEL.rol('codigo'),
    nombre: MODEL.rol('nombre'),
    _fecha_creacion: MODEL.rol('_fecha_creacion'),
    _fecha_modificacion: MODEL.rol('_fecha_modificacion')
  }]

  OUTPUT.obtener = OUTPUT.listar[0]

  OUTPUT.crear = {
    id_rol: MODEL.rol('id_rol'),
    codigo: MODEL.rol('codigo'),
    nombre: MODEL.rol('nombre'),
    _fecha_creacion: MODEL.rol('_fecha_creacion'),
    _fecha_modificacion: MODEL.rol('_fecha_modificacion')
  }

  OUTPUT.actualizar = {}

  OUTPUT.eliminar = {}

  return OUTPUT
}
