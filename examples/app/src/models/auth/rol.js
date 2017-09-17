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
        allowNull: false
      })
    },
    options: {
      uniqueKeys: ['nombre','alias'],
      plural: 'roles'
    }
  })

}
