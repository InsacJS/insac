const Field = require('../../../../lib/libs/FieldCreator')

module.exports = (sequelize, Sequelize) => {
  const MODEL = sequelize.define('libro', {
    id_libro : Field.ID(),
    titulo   : Field.STRING(),
    precio   : Field.FLOAT()
  })

  MODEL.associate = (models) => {
    const LIBRO = models.libro
    const AUTOR = models.autor
    LIBRO.belongsTo(AUTOR, { as: 'autor', foreignKey: { name: 'fid_autor', targetKey: 'id_autor', allowNull: false } })
  }

  return MODEL
}
