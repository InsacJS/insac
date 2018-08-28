const { Field } = require('insac')

module.exports = (sequelize, Sequelize) => {
  const MODEL = sequelize.define('persona', {
    id_persona: Field.ID({
      comment: 'ID persona.'
    }),
    nombre: Field.STRING({
      comment : 'Nombre completo de la persona.',
      example : 'John Smith'
    }),
    telefono: Field.STRING({
      comment : 'Número de telefono o celular.',
      example : '78885768'
    }),
    email: Field.STRING({
      comment  : 'Dirección de correo electrónico.',
      example  : 'example@gmail.com',
      validate : { isEmail: true }
    }),
    _estado               : Field.STATUS(),
    _usuario_creacion     : Field.CREATED_USER(),
    _usuario_modificacion : Field.UPDATED_USER(),
    _usuario_eliminacion  : Field.DELETED_USER(),
    _fecha_creacion       : Field.CREATED_AT(),
    _fecha_modificacion   : Field.UPDATED_AT(),
    _fecha_eliminacion    : Field.DELETED_AT()
  }, {
    schema: 'api'
  })

  MODEL.associate = (app) => {
    // TODO
  }

  return MODEL
}
