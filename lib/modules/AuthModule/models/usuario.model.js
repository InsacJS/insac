const { Field } = require('insac-field')

module.exports = (sequelize, Sequelize) => {
  const MODEL = sequelize.define('usuario', {
    id_usuario: Field.ID({ comment: 'ID del usuario' }),
    username: Field.STRING(10, {
      unique: true,
      comment: 'Nombre de usuario.',
      example: 'john',
      allowNull: false,
      validate: { len: { args: [3, 10] } }
    }),
    password: Field.STRING(100, {
      comment: 'Contraseña.',
      example: '123',
      allowNull: true,
      validate: { len: { args: [3, 100] } }
    })
  }, {
    comment: 'Usuario del sistema.'
  })

  MODEL.associate = (models) => {
    models.usuario.hasMany(models.usuario_rol, { as: 'roles_usuario', foreignKey: { name: 'fid_usuario' } })
  }

  return MODEL
}
