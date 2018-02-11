const { THIS } = require(global.INSAC)

module.exports = (app) => {
  const OUTPUT = {}

  OUTPUT.listar = [{
    id_curso: THIS(),
    nombre: THIS(),
    categoria: THIS(),
    _fecha_creacion: THIS(),
    _fecha_modificacion: THIS()
  }]

  OUTPUT.obtener = OUTPUT.listar[0]

  OUTPUT.crear = OUTPUT.obtener

  OUTPUT.actualizar = {}

  OUTPUT.eliminar = {}

  return OUTPUT
}
