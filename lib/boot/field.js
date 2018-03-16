const path = require('path')
const util = require('../tools/util')
const Field = require('field-creator').Field

const PATH_FIELD = path.resolve(process.cwd(), 'src/config/field.js')

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
  Field.AUTHORIZATION = Field.STRING(5000, {
    comment : 'Token de acceso.',
    example : 'Bearer eyJ0eXAiOiJKV.eyJpZF91c3VhcmlvI-z55A'
  })
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

  if (util.isFile(PATH_FIELD)) { require(PATH_FIELD) }
}
