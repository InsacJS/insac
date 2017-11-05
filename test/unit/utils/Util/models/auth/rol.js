'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac) => {

  return new Model('rol', {
    description: 'Rol que se asigna a un usuario del sistema.',
    fields: {
      nombre: Fields.STRING({
        description: 'Nombre completo.'
      }),
      alias: Fields.STRING({
        description: 'Nombre corto que identifica al rol.',
        required: true
      }),
      descripcion: Fields.STRING({
        description: 'Texto informativo acerca del rol.'
      })
    },
    options: {
      timestamps: true,
      uniqueKeys: ['alias'],
      plural: 'roles'
    }
  })

}
