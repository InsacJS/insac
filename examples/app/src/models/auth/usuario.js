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
      email: Fields.EMAIL({
        required: true
      }),
      reset_password_token: Fields.TOKEN({
        description: 'Token de recuperación de contraseña.'
      }),
      reset_password_expires: Fields.DATETIME({
        description: 'Fecha de expiración del token de recuperación de contraseña.'
      }),
      id_persona: Fields.REFERENCE({
        model: 'persona',
        key: 'id',
        association: { as:'usuario', type:'1:1' }
      })
    },
    options: {
      timestamps: true,
      uniqueKeys: ['username', 'email']
    }
  })

}
