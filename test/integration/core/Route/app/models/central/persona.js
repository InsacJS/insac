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
      email: Fields.EMAIL(),
      direccion: Fields.STRING({
        description: 'Dirección de domicilio.'
      }),
      telefono: Fields.INTEGER({
        description: 'Número de teléfono o celular.'
      }),
      id_usuario: Fields.REFERENCE({
        reference: { model:'usuario', key:'id' },
        association: { as:'persona', type:'1:1' }
      })
    },
    options: {
      timestamps: true,
      uniqueKeys: ['ci','email']
    }
  })

}
