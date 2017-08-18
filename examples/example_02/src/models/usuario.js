'use strict'

module.exports = (insac, Field, DataType, Validator, Reference) => {

  return insac.createModel('usuario', {
    fields: {
      id: Field.ID,
      username: {
        type: DataType.STRING(20),
        validator: Validator.STRING(1, 20),
        allowNull: false,
        description: 'Nombre corto'
      },
      password: {
        type: DataType.STRING(255),
        validator: Validator.STRING(1, 255),
        allowNull: false,
        description: 'Contraseña'
      },
      nombre: {
        type: DataType.STRING(255),
        validator: Validator.STRING(1, 255),
        description: 'Nombre completo'
      },
      email: Field.EMAIL
    },
    options: {
      uniqueKeys: [
        {fields: ['username']},
        {fields: ['email']}
      ],
      timestamps: true
    }
  })

}
