'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac) => {

  return new Model('persona', {
    description: 'Modelo que representa a una persona.',
    fields: {
      nombre: Fields.STRING({
        description: 'Nombre completo.'
      }),
      paterno: Fields.STRING({
        description: 'Apellido paterno.'
      }),
      materno: Fields.STRING({
        description: 'Apellido materno.'
      }),
      ci: Fields.INTEGER({
        description: 'Cédula de identidad.',
        required: true
      }),
      email: Fields.EMAIL({
        required: true
      }),
      direccion: Fields.STRING({
        description: 'Dirección de domicilio.'
      }),
      telefono: Fields.INTEGER({
        description: 'Número de teléfono o celular.'
      })
    },
    options: {
      timestamps: true,
      uniqueKeys: ['ci','email']
    }
  })

}
