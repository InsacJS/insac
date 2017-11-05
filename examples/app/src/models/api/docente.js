'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac) => {

  return new Model('docente', {
    description: 'Modelo que representa a un docente.',
    fields: {
      item: Fields.INTEGER({
        description: 'Nro de item.',
        example: 124
      }),
      grado: Fields.STRING({
        description: 'Grado académico.',
        example: 'Ingeniero'
      }),
      carga_horaria: Fields.INTEGER({
        description: 'Carga horaria.',
        example: 20
      }),
      tipo_contratacion: Fields.ENUM(['TITULAR','INTERINO','INVITADO'], {
        description: 'Tipo de contratación.',
        defaultValue: 'TITULAR'
      }),
      tipo_docente: Fields.ENUM(['A','B','C'], {
        description: 'Tipo de indica si es docente: investigador, de cátedra, o ambos.',
        defaultValue: 'A'
      }),
      id_persona: Fields.REFERENCE({
        reference: { model:'persona' },
        association: { as:'docente', type:'1:1' }
      })
    },
    options: {
      timestamps: true
    }
  })

}
