'use strict'

module.exports = (insac) => {

  let data = [{
    gestion: 2017,
    id_estudiante: 1,
    id_materia: 1
  }, {
    gestion: 2017,
    id_estudiante: 1,
    id_materia: 2
  }, {
    gestion: 2017,
    id_estudiante: 2,
    id_materia: 1
  }]

  return insac.createSeed('inscripcion', data)
}
