const Field = require('../../../../lib/libs/FieldCreator')

module.exports = (sequelize, Sequelize) => {
  const MODEL = sequelize.define('autor', {
    id_autor : Field.ID(),
    nombre   : Field.STRING(),
    ci       : Field.INTEGER(),
    telefono : Field.INTEGER()
  })

  MODEL.associate = (models) => {
    const AUTOR = models.autor
    const LIBRO = models.libro
    AUTOR.hasMany(LIBRO, { as: 'libros', foreignKey: { name: 'fid_autor' } })
  }

  return MODEL
}
