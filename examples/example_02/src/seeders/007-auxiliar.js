'use strict'

module.exports = (insac) => {

  let data = [{
    id: 1,
    especialidad: 'Programación',
    id_estudiante: 1
  }, {
    id: 2,
    especialidad: 'Desarrollo Web',
    id_estudiante: 2
  }]

  return insac.createSeed('auxiliar', data)
}
