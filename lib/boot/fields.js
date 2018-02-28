const Field = require('field-creator').Field

module.exports = (app) => {
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
  Field.AUTHORIZATION = Field.STRING(500, {
    comment : 'Token de acceso.',
    example : 'Bearer eyJ0eXAiOiJKV.eyJpZF91c3VhcmlvI-z55A'
  })
  Field.FIELDS = Field.STRING({
    comment : 'Campos a devolver en el resultado.',
    example : 'id_usuario,username,persona(id_persona,nombres)'
  })
  Field.SEARCH = Field.STRING({
    comment : 'Palabra a buscar en los registros',
    example : 'perez'
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
