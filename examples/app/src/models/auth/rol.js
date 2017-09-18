'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac, models) => {

  return new Model('rol', {
    description: 'Modelo que representa a un rol de usuario',
    fields: {
      nombre: Fields.STRING({
        description: 'Nombre'
      }),
      alias: Fields.STRING({
        description: 'Alias',
        required: true
      }),
      descripcion: Fields.STRING({
        description: 'Breve descripción acerca del rol'
      })
    },
    options: {
      uniqueKeys: ['alias'],
      plural: 'roles'
    }
  })

}
