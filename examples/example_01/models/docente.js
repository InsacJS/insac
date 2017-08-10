'use strict'

module.exports = (insac, Field, DataType, Validator, Reference) => {

  return insac.createModel('docente', {
    fields: {
      id: Field.ID,
      grado: {
        type: DataType.STRING(100),
        description: 'Grado académico',
        defaultValue: 'Licenciado'
      },
      id_persona: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        reference: {
          model: 'persona',
          key: 'id',
          type: Reference.ONE_TO_ONE
        },
        description: 'Identificador único de la persona'
      }
    },
    options: {
      uniqueKeys: [
        {fields: ['id_persona']}
      ],
      timestamps: true
    }
  })

}
