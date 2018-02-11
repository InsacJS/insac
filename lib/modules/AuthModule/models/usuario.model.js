const { Field } = require('insac-field')

module.exports = (sequelize, Sequelize) => {
  const MODEL = sequelize.define('usuario', {
    id_usuario: Field.ID({ comment: 'ID del usuario' }),
    username: Field.STRING(10, {
      unique: true,
      comment: 'Nombre de usuario.',
      example: 'admin',
      allowNull: false,
      allowNullMsg: 'Se requiere el nombre de usuario.',
      validate: {
        len: { args: [3, 10], msg: 'El nombre de usuario debe tener entre 3 y 10 caracteres.' }
      }
    }),
    password: Field.STRING(100, {
      comment: 'Contraseña de usuario.',
      example: '123',
      allowNull: true,
      allowNullMsg: 'Se requiere la contraseña.',
      validate: {
        len: { args: [3, 100], msg: 'La contraseña debe tener entre 3 y 100 caracteres.' }
      }
    })
  }, {
    comment: 'Usuario del sistema.'
  })

  MODEL.associate = (models) => {
    models.usuario.hasMany(models.usuario_rol, { as: 'roles_usuario', foreignKey: { name: 'fid_usuario' } })
  }

  return MODEL
}
