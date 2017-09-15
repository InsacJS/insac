'use strict'
const { Seed } = require(INSAC)

module.exports = (insac) => {

  let data = [{
    id: 1,
    nombre: 'Administrativo',
    alias: 'admin',
    descripcion: 'Rol de un administrativo'
  }, {
    id: 2,
    nombre: 'Docente',
    alias: 'doc',
    descripcion: 'Rol de un docente'
  }, {
    id: 3,
    nombre: 'Estudiante',
    alias: 'est',
    descripcion: 'Rol de un estudiante'
  }]

  return new Seed('rol', data)
}
