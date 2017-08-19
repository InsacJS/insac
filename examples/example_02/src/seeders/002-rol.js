'use strict'

module.exports = (insac) => {

  let data = [{
    id: 1,
    nombre: 'Administrador',
    alias: 'admin',
    descripcion: 'Rol del administrador'
  }, {
    id: 2,
    nombre: 'Docente',
    alias: 'doc',
    descripcion: 'Rol del docente'
  }, {
    id: 3,
    nombre: 'Estudiante',
    alias: 'est',
    descripcion: 'Rol del estudiante'
  }]

  return insac.createSeed('rol', data)
}
