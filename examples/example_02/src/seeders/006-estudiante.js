'use strict'

module.exports = (insac) => {

  let data = [{
    id: 1,
    ru: 1000,
    persona: {
      nombre: 'Juan Bautista',
      direccion: 'Los angeles, #50',
      ci: 400,
      usuario: {
        id: 4,
        username: 'est1',
        password: '123',
        nombre: 'JUAN BAUTISTA',
        email: 'est.400@gmail.com'
      }
    }
  }, {
    id: 2,
    ru: 2000,
    persona: {
      nombre: 'Rodolfo Torrez',
      direccion: 'Los angeles, #50',
      ci: 500,
      usuario: {
        id: 5,
        username: 'est2',
        password: '123',
        nombre: 'RODOLFO TORREZ',
        email: 'est.500@gmail.com'
      }
    }
  }, {
    id: 3,
    ru: 3000,
    persona: {
      nombre: 'Ana Mendoza',
      direccion: 'Los angeles, #50',
      ci: 600,
      usuario: {
        id: 6,
        username: 'est3',
        password: '123',
        nombre: 'ANA MENDOZA',
        email: 'est.600@gmail.com'
      }
    }
  }]

  return insac.createSeed('estudiante', data)
}
