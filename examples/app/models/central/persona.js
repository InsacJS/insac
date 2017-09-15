'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac, models) => {

  return new Model('persona', {
    description: 'Modelo que representa a una persona',
    fields: {
      nombre: Fields.STRING({
        description: 'Nombre completo'
      }),
      paterno: Fields.STRING({
        description: 'Apellido paterno'
      }),
      materno: Fields.STRING({
        description: 'Apellido materno'
      }),
      ci: Fields.INTEGER({
        description: 'Cédula de identidad',
        allowNull: false
      }),
      email: Fields.EMAIL({allowNull:false}),
      direccion: Fields.STRING({
        description: 'Dirección de domicilio'
      }),
      telefono: Fields.INTEGER({
        description: 'Número de teléfono o celular'
      }),
      id_usuario: Fields.ONE_TO_ONE(models.usuario)
    },
    options: {
      uniqueKeys: ['ci','email']
    }
  })

}
