'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac, models) => {

  return new Model('usuario', {
    description: 'Modelo que representa a un usuario del sistema',
    fields: {
      username: Fields.STRING({
        description: 'Usuario',
        allowNull: false
      }),
      password: Fields.STRING({
        description: 'Contraseña'
      }),
      nombre: Fields.STRING({
        description: 'Nombre completo'
      }),
      email: Fields.EMAIL({allowNull:false})
    },
    options: {
      uniqueKeys: ['username', 'email']
    }
  })

}
