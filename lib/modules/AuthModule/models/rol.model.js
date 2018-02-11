const { Field } = require('insac-field')

module.exports = (sequelize, Sequelize) => {
  const MODEL = sequelize.define('rol', {
    id_rol: Field.ID({ comment: 'ID del rol' }),
    codigo: Field.STRING(50, {
      unique: true,
      comment: 'Código asignado al rol.',
      allowNull: false,
      allowNullMsg: 'Se requiere el código del rol.',
      validate: {
        len: { args: [3, 100], msg: 'El código del rol debe tener entre 3 y 100 caracteres.' }
      }
    }),
    nombre: Field.STRING(255, {
      comment: 'Nombre del rol.',
      example: 'Administrador',
      allowNull: false,
      allowNullMsg: 'Se requiere el nombre del rol.',
      validate: {
        len: { args: [3, 255], msg: 'El nombre del rol debe tener entre 3 y 255 caracteres.' }
      }
    })
  }, {
    comment: 'Rol del sistema.'
  })

  MODEL.associate = (models) => {
    models.rol.hasMany(models.usuario_rol, { as: 'usuarios_rol', foreignKey: { name: 'fid_rol' } })
  }

  return MODEL
}
