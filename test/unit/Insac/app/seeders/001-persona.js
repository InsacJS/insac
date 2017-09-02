'use strict'

module.exports = (seeder) => {

  let data = [{
    id: 1,
    nombre: 'Juan Perez',
    usuario: {
      username: 'admin',
      password: 'admin'
    }
  }, {
    id: 2,
    nombre: 'Ana Mendoza',
    usuario: {
      username: 'superadmin',
      password: 'superadmin'
    }
  }, {
    id: 3,
    nombre: 'Jhon Smith',
    usuario: {
      username: 'user',
      password: 'user'
    }
  }]

  return seeder.create('persona', data)
}
