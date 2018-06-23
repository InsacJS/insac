const { ResourceModule } = require(global.INSAC)

module.exports = (app) => {
  return new ResourceModule(app.config.API)
}
