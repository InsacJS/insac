const { ResourceModule } = require(global.INSAC)

module.exports = (app) => {
  const CONFIG = app.config.API

  return new ResourceModule(CONFIG)
}
