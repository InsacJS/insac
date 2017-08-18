'use strict'

module.exports = (insac, Field, DataType, Validator, Reference) => {

  return insac.createModel('materia', {
    fields: {
      id: Field.ID,
      nombre: {
        type: DataType.STRING(100),
        validator: Validator.STRING(5,100),
        allowNull: false,
        description: 'Nombre'
      },
      sigla: {
        type: DataType.STRING(15),
        validator: Validator.STRING(1,15),
        allowNull: false,
        description: 'Sigla'
      },
    },
    options: {
      uniqueKeys: [
        {fields: ['sigla']}
      ],
      timestamps: true
    }
  })

}
