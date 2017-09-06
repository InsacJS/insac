

module.exports = (seeder) => {

  let data = [{
    id: 1,
    nombre: 'Calculo I'
  }, {
    id: 2,
    nombre: 'Fisica II'
  }, {
    id: 3,
    nombre: 'Electrónica'
  }]

  return seeder.create('materia', data)
}
