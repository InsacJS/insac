const { Field } = require('insac')

module.exports = (sequelize, Sequelize) => {
  const MODEL = sequelize.define('post', {
    id_post: Field.ID({
      comment: 'ID post.'
    }),
    titulo: Field.STRING({
      comment : 'Título del post.',
      example : 'Inteligencia Artificial'
    }),
    fecha: Field.DATE({
      comment: 'Fecha de publicación.'
    }),
    descripcion: Field.TEXT({
      comment : 'Contenido del post.',
      example : 'La inteligencia artificial ...'
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
    const PERSONA = app.API.models.persona
    const POST    = app.API.models.post

    POST.belongsTo(PERSONA, { as: 'autor', foreignKey: { name: 'fid_autor', targetKey: 'id_persona' } })
    PERSONA.hasMany(POST,   { as: 'posts', foreignKey: { name: 'fid_autor' } })
  }

  return MODEL
}
