'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac) => {

  return new Model('administrativo', {
    description: 'Modelo que representa a un personal administrativo.',
    fields: {
      cargo: Fields.STRING({
        description: 'Cargo o puesto administrativo.'
      }),
      id_persona: Fields.REFERENCE({
        required: true,
        reference: { model:'persona' },
        association: { as:'administrativo', type:'1:1' }
      })
    },
    options: {
      timestamps: true
    }
  })

}
