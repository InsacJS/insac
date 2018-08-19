/** @ignore */ const Field = require('../libs/FieldCreator')

// |=============================================================|
// |-------------- CAMPOS DE TIPO CLAVE PRIMARIA ----------------|
// |=============================================================|

Field.use('ID', Field.INTEGER({
  primaryKey    : true,
  autoIncrement : true,
  allowNull     : false,
  validate      : { min: 1 }
}))

// |=============================================================|
// |-------------- CAMPOS DE AUDITORIA --------------------------|
// |=============================================================|

Field.use('CREATED_AT', Field.DATE({
  comment: 'Fecha de creación del registro.'
}))
Field.use('UPDATED_AT', Field.DATE({
  comment: 'Fecha de modificación del registro.'
}))
Field.use('DELETED_AT', Field.DATE({
  comment: 'Fecha de eliminación del registro.'
}))
Field.use('CREATED_USER', Field.INTEGER({
  comment: 'ID del usuario que crea el registro.'
}))
Field.use('UPDATED_USER', Field.INTEGER({
  comment: 'ID del usuario que modifica el registro.'
}))
Field.use('DELETED_USER', Field.INTEGER({
  comment: 'ID del usuario que elimina el registro.'
}))
Field.use('STATUS', Field.ENUM(['ACTIVO', 'INACTIVO', 'ELIMINADO'], {
  comment      : 'Estado en el que se encuentra el registro.',
  defaultValue : 'ACTIVO'
}))

// |=============================================================|
// |-------------- CAMPOS DE FILTROS Y CONSULTAS ----------------|
// |=============================================================|

Field.use('FIELDS', Field.STRING({
  comment : 'Campos a devolver en el resultado.',
  example : 'id_usuario,username,persona(id_persona,nombres)'
}))
Field.use('ORDER', Field.STRING({
  comment : 'Orden en el que se devolverá el resultado.',
  example : 'apellido,-nombres'
}))
Field.use('LIMIT', Field.INTEGER({
  comment      : 'Límite de registros por página.',
  defaultValue : 50,
  validate     : { min: 1 }
}))
Field.use('PAGE', Field.INTEGER({
  comment      : 'Número de página de una lista de registros.',
  defaultValue : 1,
  validate     : { min: 1 }
}))

module.exports = Field
