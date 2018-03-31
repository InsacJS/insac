/** @ignore */ const Field = require('field-creator').Field

// |=============================================================|
// |-------------- CAMPOS DE AUDITORIA --------------------------|
// |=============================================================|

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
Field.STATUS = Field.ENUM(['ACTIVO', 'INACTIVO', 'ELIMINADO'], {
  comment      : 'Estado en el que se encuentra el registro.',
  defaultValue : 'ACTIVO'
})

// |=============================================================|
// |-------------- CAMPOS DE FILTROS Y CONSULTAS ----------------|
// |=============================================================|

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
  defaultValue : 50,
  validate     : { min: 1 }
})
Field.PAGE = Field.INTEGER({
  comment      : 'Número de página de una lista de registros.',
  defaultValue : 1,
  validate     : { min: 1 }
})

// |=============================================================|
// |-------------- CAMPOS DE AUTENTICACIÓN ----------------------|
// |=============================================================|

Field.BASIC_AUTHORIZATION = Field.STRING(5000, {
  comment   : 'Credenciales de acceso. <code>Basic [username:password] base64</code>',
  example   : 'Basic FDS234SF==',
  allowNull : false
})
Field.BEARER_AUTHORIZATION = Field.STRING(5000, {
  comment   : 'Credenciales del acceso. <code>Bearer [accessToken]</code>',
  example   : 'Bearer s83hs7.sdf423.f23f',
  allowNull : false
})
Field.ACCESS_TOKEN = Field.STRING(5000, {
  comment : 'Token de acceso.',
  example : 's83hs7.sdf423.f23f'
})
Field.REFRESH_TOKEN = Field.STRING(5000, {
  comment : 'Token de refresco.',
  example : 's83hs7.sdf423.f23f'
})
Field.TOKEN_EXPIRATION_DATE = Field.DATE({
  comment: 'Fecha de expiración del token.'
})
Field.TOKEN_EXPIRE_IN = Field.DATE({
  comment: 'Tiempo de expiración del token.'
})
Field.TOKEN_TYPE = Field.DATE({
  comment : 'Tipo de token.',
  example : 'Bearer'
})

module.exports = Field
