'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac) => {

  return new Model('persona', {
    description: 'Modelo que representa a una persona.',
    fields: {
      nombre: Fields.STRING({
        description: 'Nombre completo.',
        example: 'Juan Carlos'
      }),
      paterno: Fields.STRING({
        description: 'Apellido paterno.',
        example: 'Mendoza'
      }),
      materno: Fields.STRING({
        description: 'Apellido materno.',
        example: 'Gonzales'
      }),
      ci: Fields.INTEGER({
        description: 'Cédula de identidad.',
        required: true,
        example: 8675867
      }),
      email: Fields.EMAIL(),
      direccion: Fields.STRING({
        description: 'Dirección de domicilio.',
        example: 'Zona Sur, #48'
      }),
      telefono: Fields.INTEGER({
        description: 'Número de teléfono o celular.',
        example: 22234348
      })
    },
    options: {
      timestamps: true,
      uniqueKeys: ['ci','email']
    }
  })

}
