'use strict'

module.exports = (insac) => {

  let data = [{
    id: 1,
    nombre: 'Introducción a la informática',
    sigla: 'INF-111'
  }, {
    id: 2,
    nombre: 'Algoritmos y programación',
    sigla: 'INF-121'
  }]

  return insac.createSeed('materia', data)
}
