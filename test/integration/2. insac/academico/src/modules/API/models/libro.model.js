const { Field } = require(global.INSAC)

module.exports = (sequelize, Sequelize) => {
  const MODEL = sequelize.define('libro', {
    id: Field.ID({
      comment: 'ID libro.'
    }),
    titulo: Field.STRING({
      comment : 'Título del libro.',
      example : 'El gato negro'
    }),
    nro_paginas: Field.INTEGER({
      comment : 'Número de páginas.',
      example : 100
    }),
    precio: Field.FLOAT({
      comment : 'Precio de venta.',
      example : 124.99
    }),
    resumen: Field.TEXT({
      comment : 'Resúmen o descripción del libro.',
      example : 'Obra literaria que trata sobre una historia ...'
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
    const LIBRO = app.API.models.libro
    const AUTOR = app.API.models.autor

    LIBRO.belongsTo(AUTOR, { as: 'autor',  foreignKey: { name: 'fid_autor', targetKey: 'id' } })
    AUTOR.hasMany(LIBRO,   { as: 'libros', foreignKey: { name: 'fid_autor' } })
  }

  return MODEL
}
