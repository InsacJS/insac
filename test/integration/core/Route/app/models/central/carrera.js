'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac) => {

  return new Model('carrera', {
    description: 'Modelo que representa a una carrera universitaria.',
    fields: {
      nombre: Fields.STRING({
        description: 'Nombre.',
        required: true
      })
    },
    options: {
      timestamps: true,
      uniqueKeys: ['nombre']
    }
  })

}
