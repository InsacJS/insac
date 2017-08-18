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
        type: DataType.STRING(255),
        validator: Validator.STRING(1,255),
        description: 'Dirección'
      },
      ci: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        description: 'Cédula de identidad'
      },
      id_usuario: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        reference: Reference.ONE_TO_ONE('usuario','id'),
        description: 'Identificador único del usuario'
      }
    },
    options: {
      uniqueKeys: [
        {fields: ['ci']},
        {fields: ['id_usuario']}
      ],
      timestamps: true
    }
  })

}
