'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac) => {

  return new Model('usuario', {
    description: 'Usuario del sistema.',
    fields: {
      username: Fields.STRING({
        description: 'Usuario.',
        required: true
      }),
      password: Fields.STRING({
        description: 'Contraseña.',
        required: true
      }),
      nombre: Fields.STRING({
        description: 'Nombre.',
        required: true
      }),
      email: Fields.EMAIL({
        required: true
      })
    },
    options: {
      timestamps: true,
      uniqueKeys: ['username', 'email']
    }
  })

}
