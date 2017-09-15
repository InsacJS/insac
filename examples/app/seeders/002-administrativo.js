'use strict'
const { Seed } = require(INSAC)

module.exports = (insac) => {

  let data = [{
    id: 1,
    cargo: 'Administrador',
    persona: {
      nombre: 'Jhon',
      paterno: 'Smith',
      materno: 'Smith',
      ci: 8765768,
      email: 'jhon.smith.smith@gmail.com',
      dirección: 'Los pinos, #24',
      telefono: 78898787,
      usuario: {
        id: 1,
        username: 'admin',
        password: insac.encryptPassword('admin'),
        nombre: 'Jhon Smith Smith',
        email: 'jhon.smith.smith@gmail.com'
      }
    }
  }]

  return new Seed('administrativo', data)
}
