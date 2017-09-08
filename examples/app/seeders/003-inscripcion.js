'use strict'

module.exports = (seeder) => {

  let data = [{
    id: 1,
    gestion: 2017,
    id_persona: 1,
    id_materia: 1
  }, {
    id: 2,
    gestion: 2017,
    id_persona: 1,
    id_materia: 2
  }, {
    id: 3,
    gestion: 2017,
    id_persona: 1,
    id_materia: 3
  }, {
    id: 4,
    gestion: 2017,
    id_persona: 2,
    id_materia: 1
  }]

  return seeder.create('inscripcion', data)
}
