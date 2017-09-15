'use strict'
const { Model, Fields, Validators } = require(INSAC)

module.exports = (insac, models) => {

  return new Model('rol_usuario', {
    description: 'Modelo que describe todos los roles de un determinado usuario',
    fields: {
      estado: Fields.STRING({
        description: 'Estado de la cuenta',
        allowNull: false,
        validator: Validators.IN(['ACTIVO','INACTIVO']),
        defaultValue: 'ACTIVO'
      }),
      id_usuario: Fields.ONE_TO_MANY(models.usuario),
      id_rol: Fields.ONE_TO_MANY(models.rol)
    },
    options: {
      uniqueKeys: [['id_usuario','id_rol']],
      plural: 'roles_usuarios'
    }
  })

}
