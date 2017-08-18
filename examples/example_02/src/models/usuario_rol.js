'use strict'

module.exports = (insac, Field, DataType, Validator, Reference) => {

  return insac.createModel('usuario_rol', {
    fields: {
      id: Field.ID,
      estado: {
        type: DataType.STRING(20),
        validator: Validator.IN(['ACTIVO', 'INACTIVO']),
        allowNull: false,
        defaultValue: 'INACTIVO',
        description: 'Estado de la cuenta'
      },
      id_usuario: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        reference: Reference.ONE_TO_MANY('usuario','id'),
        description: 'Identificador único del usuario'
      },
      id_rol: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        reference: Reference.ONE_TO_MANY('rol','id'),
        description: 'Identificador único del rol'
      }
    },
    options: {
      uniqueKeys: [
        {fields: ['id_usuario','id_rol']}
      ],
      timestamps: true,
      plural: 'usuarios_roles'
    }
  })

}
