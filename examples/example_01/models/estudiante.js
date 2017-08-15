'use strict'

module.exports = (insac, Field, DataType, Validator, Reference) => {

  return insac.createModel('estudiante', {
    fields: {
      id: Field.ID,
      ru: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        defaultValue: 9999,
        description: 'Registro Universitario'
      },
      id_persona: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        reference: Reference.ONE_TO_ONE('persona','id'),
        description: 'Identificador único de la persona'
      }
    },
    options: {
      uniqueKeys: [
        {fields: ['ru']},
        {fields: ['id_persona']}
      ],
      timestamps: true
    }
  })

}
