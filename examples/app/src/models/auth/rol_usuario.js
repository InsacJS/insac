'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac) => {

  return new Model('rol_usuario', {
    description: 'Contiene todos los roles de los usuarios.',
    fields: {
      estado: Fields.ENUM(['ACTIVO','INACTIVO'], {
        description: 'Estado de la cuenta',
        required: true,
        defaultValue: 'ACTIVO'
      }),
      id_usuario: Fields.REFERENCE({
        model: 'usuario',
        key: 'id',
        required: true,
        association: { as:'roles_usuarios', type:'1:N' }
      }),
      id_rol: Fields.REFERENCE({
        model: 'rol'
        key: 'id',
        required: true,
        association: { as:'roles_usuarios', type:'1:N' } })
    },
    options: {
      timestamps: true,
      uniqueKeys: [['id_usuario','id_rol']],
      plural: 'roles_usuarios'
    }
  })

}
