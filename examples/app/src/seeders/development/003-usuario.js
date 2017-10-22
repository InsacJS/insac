'use strict'
const { Seed } = require(INSAC)

module.exports = (insac) => {

  let data = [{
    id: 1,
    username: 'admin',
    password: insac.encryptPassword('admin'),
    nombre: 'Jhon Smith Smith',
    email: 'jhon.smith.smith@gmail.com',
    id_persona: 1
  }]

  return new Seed('administrativo', data)
}
