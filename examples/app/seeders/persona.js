

module.exports = (seeder) => {

  let data = [{
    nombre: 'Jhon Smith',
    usuario: {
      username: 'admin',
      password: '123'
    }
  }, {
    nombre: 'Andrea Belen',
    usuario: {
      username: 'user1',
      password: '123'
    }
  }, {
    nombre: 'Rosa Flores',
    usuario: {
      username: 'user2',
      password: '123'
    }
  }]

  return seeder.create('persona', data)
}
