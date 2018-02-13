const { Field } = require('insac-field')

module.exports = (sequelize, Sequelize) => {
  const MODEL = sequelize.define('usuario_rol', {
    id_usuario_rol: Field.ID({ comment: 'ID usuario_rol' }),
    estado: Field.ENUM(['ACTIVO', 'INACTIVO'], {
      defaultValue: 'ACTIVO',
      allowNull: false
    })
  }, {
    comment: 'Contiene los roles asignados a los usuarios del sistema.'
  })

  MODEL.associate = (models) => {
    models.usuario_rol.belongsTo(models.usuario, { as: 'usuario',
      foreignKey: { name: 'fid_usuario', targetKey: 'id_usuario', allowNull: false }
    })
    models.usuario_rol.belongsTo(models.rol, { as: 'rol',
      foreignKey: { name: 'fid_rol', targetKey: 'id_rol', allowNull: false }
    })
  }

  return MODEL
}
