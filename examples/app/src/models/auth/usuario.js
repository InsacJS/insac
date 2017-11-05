'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac) => {

  return new Model('usuario', {
    description: 'Usuario del sistema.',
    fields: {
      username: Fields.STRING({
        description: 'Usuario.',
        required: true,
        example: 'admin'
      }),
      password: Fields.STRING({
        description: 'Contraseña.',
        required: true,
        example: '123'
      }),
      email: Fields.EMAIL({
        required: true
      }),
      reset_password_token: Fields.TOKEN({
        description: 'Token de recuperación de contraseña.',
        example: 'ABC123'
      }),
      reset_password_expires: Fields.DATETIME({
        description: 'Fecha de expiración del token de recuperación de contraseña.',
        example: 'ABC123'
      }),
      id_persona: Fields.REFERENCE({
        reference: { model:'persona', key:'id' },
        association: { as:'usuario', type:'1:1' }
      })
    },
    options: {
      timestamps: true,
      uniqueKeys: ['username', 'email']
    }
  })

}
