

module.exports = (seeder) => {

  let data = [{
    id: 1,
    nombre: 'Jhon Smith',
    usuario: {
      username: 'admin',
      password: '123'
    }
  }, {
    id: 2,
    nombre: 'Andrea Belen',
    usuario: {
      username: 'user1',
      password: '123'
    }
  }, {
    id: 3,
    nombre: 'Rosa Flores',
    usuario: {
      username: 'user2',
      password: '123'
    }
  }]

  return seeder.create('persona', data)
}
