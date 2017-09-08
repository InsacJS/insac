'use strict'

module.exports = (seeder) => {

  let data = [{
    id: 1,
    nombre: 'Calculo I',
    sigla: 'MAT-101'
  }, {
    id: 2,
    nombre: 'Fisica II',
    sigla: 'FIS-102'
  }, {
    id: 3,
    nombre: 'Electrónica',
    sigla: 'FIS-204'
  }]

  return seeder.create('materia', data)
}
