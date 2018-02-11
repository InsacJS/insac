const { AuthModule } = require(global.INSAC)

module.exports = (app, CONFIG) => {
  CONFIG.roles = [
    { id_rol: 1, codigo: 'ADMIN', nombre: 'Administrador' }
  ]

  CONFIG.usuarios = [
    { id_usuario: 1, username: 'admin', password: '123' },
    { id_usuario: 2, username: 'anna', password: '123' },
    { id_usuario: 3, username: 'alex', password: '123' },
    { id_usuario: 4, username: 'lucy', password: '123' },
    { id_usuario: 5, username: 'john', password: '123' }
  ]

  CONFIG.usuarios_roles = [
    { fid_usuario: 1, fid_rol: 1 },
    { fid_usuario: 2, fid_rol: 1 },
    { fid_usuario: 3, fid_rol: 1 },
    { fid_usuario: 4, fid_rol: 1 },
    { fid_usuario: 5, fid_rol: 1 }
  ]

  return new AuthModule(app, CONFIG)
}
