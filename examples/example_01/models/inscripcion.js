'use strict'

module.exports = (insac, Field, DataType, Validator, Reference) => {

  return insac.createModel('inscripcion', {
    fields: {
      id: Field.ID,
      gestion: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        defaultValue: 2017,
        description: 'Gestión académica'
      },
      id_estudiante: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        reference: {
          model: 'estudiante',
          key: 'id',
          type: Reference.ONE_TO_MANY
        },
        description: 'Identificador único del estudiante'
      },
      id_materia: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        reference: {
          model: 'materia',
          key: 'id',
          type: Reference.ONE_TO_MANY
        },
        description: 'Identificador único de la materia'
      }
    },
    options: {
      uniqueKeys: [
        {fields: ['id_estudiante','id_materia']}
      ],
      timestamps: true,
      plural: 'inscripciones'
    }
  })

}
