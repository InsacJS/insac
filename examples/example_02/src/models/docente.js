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
        reference: Reference.ONE_TO_ONE('persona','id'),
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
