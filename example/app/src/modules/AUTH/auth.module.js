const { AuthModule } = require('insac')

module.exports = (app) => {
  const OPTIONS = {}

  OPTIONS.roles = [
    { name: 'admin', description: 'Administrador' }
  ]

  return new AuthModule(app, OPTIONS)
}
