'use strict'

module.exports = (insac, Field, DataType, Validator, Reference) => {

  return insac.createModel('rol', {
    fields: {
      id: Field.ID,
      nombre: {
        type: DataType.STRING(100),
        validator: Validator.STRING(5,100),
        allowNull: false,
        description: 'Nombre(s)'
      },
      alias: {
        type: DataType.STRING(15),
        validator: Validator.STRING(1,15),
        allowNull: false,
        description: 'Alias (nombre corto que identifica el rol)'
      },
      descripcion: {
        type: DataType.STRING(255),
        validator: Validator.STRING(1, 255),
        description: 'Descripción breve de quienes utilizarán el rol'
      }
    },
    options: {
      uniqueKeys: [
        {fields: ['nombre']},
        {fields: ['alias']}
      ],
      timestamps: true,
      plural: 'roles'
    }
  })

}
