const Field = require('field-creator').Field

module.exports = (app) => {
  // Campos de auditoria
  Field.CREATED_AT = Field.DATE({
    comment: 'Fecha de creación del registro.'
  })
  Field.UPDATED_AT = Field.DATE({
    comment: 'Fecha de modificación del registro.'
  })
  Field.DELETED_AT = Field.DATE({
    comment: 'Fecha de eliminación del registro.'
  })
  Field.CREATED_USER = Field.INTEGER({
    comment   : 'ID del usuario que crea el registro.',
    allowNull : false
  })
  Field.UPDATED_USER = Field.INTEGER({
    comment: 'ID del usuario que modifica el registro.'
  })
  Field.DELETED_USER = Field.INTEGER({
    comment: 'ID del usuario que elimina el registro.'
  })

  // Campos para filtros y consultas
  Field.FIELDS = Field.STRING({
    comment : 'Campos a devolver en el resultado.',
    example : 'id_usuario,username,persona(id_persona,nombres)'
  })
  Field.ORDER = Field.STRING({
    comment : 'Orden en el que se devolverá el resultado.',
    example : 'apellido,-nombres'
  })
  Field.LIMIT = Field.INTEGER({
    comment      : 'Límite de registros por página.',
    defaultValue : 50
  })
  Field.PAGE = Field.INTEGER({
    comment      : 'Número de página de una lista de registros.',
    defaultValue : 1
  })
}
