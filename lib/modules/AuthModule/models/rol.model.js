const { Field } = require('insac-field')

module.exports = (sequelize, Sequelize) => {
  const MODEL = sequelize.define('rol', {
    id_rol: Field.ID({ comment: 'ID del rol' }),
    nombre: Field.STRING(50, {
      unique: true,
      comment: 'Nombre del rol.',
      example: 'ADMIN',
      allowNull: false,
      validate: { len: { args: [3, 50] } }
    }),
    descripcion: Field.STRING(255, {
      comment: 'Descripción del rol.',
      example: 'Rol para el administrador del sistema.',
      allowNull: false,
      validate: { len: { args: [3, 255] } }
    })
  }, {
    comment: 'Rol del sistema.'
  })

  MODEL.associate = (models) => {
    models.rol.hasMany(models.usuario_rol, { as: 'usuarios_rol', foreignKey: { name: 'fid_rol' } })
  }

  return MODEL
}
