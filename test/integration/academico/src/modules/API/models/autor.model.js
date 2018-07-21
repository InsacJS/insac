const { Field } = require(global.INSAC)

module.exports = (sequelize, Sequelize) => {
  const MODEL = sequelize.define('autor', {
    id: Field.ID({
      comment: 'ID autor.'
    }),
    nombre: Field.STRING({
      comment : 'Nombre completo del autor.',
      example : 'John Smith Smith'
    }),
    direccion: Field.STRING({
      comment : 'Dirección del domicilio de la persona.',
      example : 'Zona los valles, #267'
    }),
    telefono: Field.ARRAY(Field.INTEGER(), {
      comment : 'Números de telefono de contacto.',
      example : [22837563, 78576854]
    }),
    tipo: Field.ENUM(['NACIONAL', 'INTERNACIONAL'], {
      comment : 'Tipo de autor según su nacionalidad.',
      example : 'NACIONAL'
    }),
    activo: Field.BOOLEAN({
      comment : 'Indica si el autor se encuentra activo.',
      example : true
    }),
    _estado               : Field._STATUS(),
    _usuario_creacion     : Field._CREATED_USER(),
    _usuario_modificacion : Field._UPDATED_USER(),
    _usuario_eliminacion  : Field._DELETED_USER(),
    _fecha_creacion       : Field._CREATED_AT(),
    _fecha_modificacion   : Field._UPDATED_AT(),
    _fecha_eliminacion    : Field._DELETED_AT()
  }, {
    schema: 'api'
  })

  MODEL.associate = (app) => {
    // TODO
  }

  return MODEL
}
