module.exports = (app) => {
  const MODEL = app.FIELD.models
  const OUTPUT = {}

  OUTPUT.listar = [{
    id_curso: MODEL.curso('id_curso'),
    nombre: MODEL.curso('nombre'),
    categoria: MODEL.curso('categoria'),
    _fecha_creacion: MODEL.curso('_fecha_creacion'),
    _fecha_modificacion: MODEL.curso('_fecha_modificacion')
  }]

  OUTPUT.obtener = OUTPUT.listar[0]

  OUTPUT.crear = OUTPUT.obtener

  OUTPUT.actualizar = {}

  OUTPUT.eliminar = {}

  return OUTPUT
}
