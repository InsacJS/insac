const { Field } = require(global.INSAC)

module.exports = (sequelize, Sequelize) => {
  const MODEL = sequelize.define('usuario', {
    id: Field.ID({
      comment: 'ID usuario.'
    }),
    username: Field.STRING(100, {
      comment  : 'Nombre de usuario.',
      example  : 'admin',
      validate : { len: { args: [3, 100], msg: 'El nombre de usuario debe tener entre 3 y 100 caracteres.' } }
    }),
    password: Field.STRING(50, {
      comment  : 'Contraseña de usuario.',
      example  : '123',
      validate : { len: { args: [3, 50], msg: 'La contraseña debe tener entre 3 y 50 caracteres.' } }
    }),
    password_recovery_code: Field.UUID({
      comment: 'Código de recuperación de contraseña.'
    }),
    password_recovery_code_expiration: Field.DATE({
      comment: 'Fecha de expiración del código de recuperación de contraseña.'
    }),
    email: Field.STRING({
      comment  : 'Dirección de correo electrónico',
      example  : 'alguien@example.com',
      validate : { isEmail: true }
    }),
    rol: Field.ENUM(['superadmin', 'admin', 'user'], {
      comment : 'Lista de roles del usuario',
      default : 'user'
    }),
    nombre: Field.STRING(50, {
      comment : 'Nombre(s) de la persona.',
      example : 'John'
    }),
    primer_apellido: Field.STRING(50, {
      comment : 'Primer apellido.',
      example : 'Smith'
    }),
    segundo_apellido: Field.STRING(50, {
      comment : 'Segundo Apellido',
      example : 'Smith'
    }),
    documento_identidad: Field.STRING(20, {
      comment : 'Número del documento de identidad.',
      example : '85763857'
    }),
    direccion: Field.STRING({
      comment : 'Dirección del domicilio de la persona.',
      example : 'Zona Los Alamos, #35'
    }),
    telefono: Field.STRING(20, {
      comment : 'Número telefónico o de celular.',
      example : '78895868'
    }),
    cargo: Field.STRING({
      comment : 'Cargo que ocupa el administrador del sistema.',
      example : 'Director académico'
    }),
    _estado               : Field.STATUS(),
    _usuario_creacion     : Field.CREATED_USER(),
    _usuario_modificacion : Field.UPDATED_USER(),
    _usuario_eliminacion  : Field.DELETED_USER(),
    _fecha_creacion       : Field.CREATED_AT(),
    _fecha_modificacion   : Field.UPDATED_AT(),
    _fecha_eliminacion    : Field.DELETED_AT()
  }, {
    schema: 'auth'
  })

  MODEL.associate = (app) => {}

  return MODEL
}
