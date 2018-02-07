const { ResourceModule } = require(global.INSAC)

module.exports = (app) => {
  const OPTIONS = {}

  OPTIONS.moduleName = 'API'

  return new ResourceModule(app, OPTIONS)
}
