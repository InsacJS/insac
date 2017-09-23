'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac, models, db) => {

  return new Model('usuario', {
    description: 'Modelo que representa a un usuario del sistema',
    fields: {
      username: Fields.STRING({
        description: 'Usuario',
        required: true
      }),
      password: Fields.STRING({
        description: 'Contraseña'
      }),
      nombre: Fields.STRING({
        description: 'Nombre completo'
      }),
      email: Fields.EMAIL({required:true})
    },
    options: {
      uniqueKeys: ['username', 'email']
    }
  })

}
