const { ResourceModule } = require(global.INSAC)

module.exports = (app, CONFIG) => {
  return new ResourceModule(app, CONFIG)
}
