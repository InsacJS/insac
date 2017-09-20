'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac, models) => {

  return new Model('usuario', {
    fields: {
      username: Fields.STRING({description: 'Usuario'}),
      password: Fields.STRING({description: 'Contraseña'})
    }
  })

}