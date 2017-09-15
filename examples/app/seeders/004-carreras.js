'use strict'
const { Seed } = require(INSAC)

module.exports = (insac) => {

  let data = [{
    nombre: 'Ingeniería Industrial'
  }, {
    nombre: 'Ingeniería CIvil'
  }, {
    nombre: 'Ingeniería Electrónica'
  }]

  return new Seed('carrera', data)
}
