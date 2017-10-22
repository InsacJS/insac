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
        model: 'persona',
        key: 'id',
        required: true,
        association: { as:'estudiante', type:'1:1' }
      }),
      id_carrera: Fields.REFERENCE({
        model: 'carrera',
        key: 'id',
        required: true,
        association: { as:'estudiante', type:'1:1' }
      })
    },
    options: {
      timestamps: true
    }
  })

}
