const ResourceModule = require('../ResourceModule/ResourceModule')
const { Seed } = require('insac-seed')
const path = require('path')

class AuthModule extends ResourceModule {
  constructor (app, CONFIG) {
    CONFIG.daoPath = path.resolve(__dirname, 'dao')
    CONFIG.routesPath = path.resolve(__dirname, 'routes')
    CONFIG.modelsPath = path.resolve(__dirname, 'models')
    CONFIG.fieldsPath = path.resolve(__dirname, 'fields')
    CONFIG.daoExt = '.dao.js'
    CONFIG.routeExt = '.route.js'
    CONFIG.modelExt = '.model.js'
    CONFIG.fieldExt = '.field.js'
    super(app, CONFIG)
    this.roles = CONFIG.roles
    this.usuarios = CONFIG.usuarios
    this.usuarios_roles = CONFIG.usuarios_roles
    this.seedersPath = null
    this.seedExt = null
  }
  async onSetup (app) {
    await super.onSetup(app)
    await Seed.create(app.DB.sequelize, 'rol', this.roles)
    await Seed.create(app.DB.sequelize, 'usuario', this.usuarios)
    await Seed.create(app.DB.sequelize, 'usuario_rol', this.usuarios_roles)
  }
  async onStart (app) {
    await super.onStart(app)
  }
}

module.exports = AuthModule
