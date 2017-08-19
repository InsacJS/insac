'use strict'

module.exports = (insac) => {

  let data = [{
    id: 1,
    grado: 'Licenciado en Informática',
    persona: {
      nombre: 'Juan Perez',
      direccion: 'Los angeles, #50',
      ci: 100,
      usuario: {
        id: 1,
        username: 'doc1',
        password: '123',
        nombre: 'JUAN PEREZ',
        email: 'doc.100@gmail.com'
      }
    }
  }, {
    id: 2,
    grado: 'Ingeniero de Sistemas',
    persona: {
      nombre: 'Rosa Flores',
      direccion: 'Los angeles, #50',
      ci: 200,
      usuario: {
        id: 2,
        username: 'doc2',
        password: '123',
        nombre: 'ROSA FLORES',
        email: 'doc.200@gmail.com'
      }
    }
  }, {
    id: 3,
    grado: 'Doctor en Ciencias de la Educacións',
    persona: {
      nombre: 'Lucía Mendez',
      direccion: 'Los angeles, #50',
      ci: 300,
      usuario: {
        id: 3,
        username: 'doc3',
        password: '123',
        nombre: 'LUCIA MENDEZ',
        email: 'doc.300@gmail.com'
      }
    }
  }]

  return insac.createSeed('docente', data)
}
