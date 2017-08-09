'use strict'

module.exports = (insac, Field, DataType, Validator, Reference) => {

  return insac.createModel('persona', {
    fields: {
      id: Field.ID,
      nombre: {
        type: DataType.STRING(100),
        validator: Validator.STRING(5,100),
        description: 'Nombre(s)'
      },
      direccion: {
        type: DataType.STRING,
        allowNull: false,
        description: 'Dirección',
      },
      ci: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        description: 'Cédula de identidad'
      }
    },
    options: {
      uniqueKeys: [
        {fields: ['direccion', 'ci']},
        {fields: ['nombre']}
      ],
      timestamps: true
    }
  })

}
