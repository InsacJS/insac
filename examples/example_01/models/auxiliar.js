'use strict'

module.exports = (insac, Field, DataType, Validator, Reference) => {

  return insac.createModel('auxiliar', {
    fields: {
      id: Field.ID,
      especialidad: {
        type: DataType.STRING,
        defaultValue: 'Programación',
        description: 'Área de especialidad'
      },
      id_estudiante: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        reference: {
          model: 'estudiante',
          key: 'id',
          type: Reference.ONE_TO_ONE
        },
        description: 'Identificador único del estudiante'
      }
    },
    options: {
      uniqueKeys: [
        {fields: ['id_estudiante']}
      ],
      timestamps: true
    }
  })

}
