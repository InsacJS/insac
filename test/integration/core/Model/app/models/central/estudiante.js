'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac) => {

  return new Model('estudiante', {
    description: 'Modelo que representa a un estudiante.',
    fields: {
      ru: Fields.INTEGER({
        description: 'Nro de registro universitario.'
      }),
      id_persona: Fields.REFERENCE({
        required: true,
        reference: { model:'persona' },
        association: { as:'estudiante', type:'1:1' }
      }),
      id_carrera: Fields.REFERENCE({
        required: true,
        reference: { model:'carrera' },
        association: { as:'estudiantes', type:'1:N' }
      })
    },
    options: {
      timestamps: true
    }
  })

}
