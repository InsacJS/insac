const { THIS } = require('insac-field')

module.exports = (app) => {
  const OUTPUT = {}

  OUTPUT.listar = [{
    id_rol: THIS(),
    codigo: THIS(),
    nombre: THIS(),
    _fecha_creacion: THIS(),
    _fecha_modificacion: THIS()
  }]

  OUTPUT.obtener = OUTPUT.listar[0]

  OUTPUT.crear = {
    id_rol: THIS(),
    codigo: THIS(),
    nombre: THIS(),
    _fecha_creacion: THIS(),
    _fecha_modificacion: THIS()
  }

  OUTPUT.actualizar = {}

  OUTPUT.eliminar = {}

  return OUTPUT
}
