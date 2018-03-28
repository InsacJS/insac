const path   = require('path')
const Module = require('./Module')
const util   = require('../tools/util')
const _      = require('lodash')

class ServiceModule extends Module {
  constructor (config) {
    super(config)
    this.config.localPath  = this.config.localPath  || path.resolve(this.config.modulePath, 'local')
    this.config.publicPath = this.config.publicPath || path.resolve(this.config.modulePath, 'public')
  }
  async onSetup (app) {
    await super.onSetup(app)
  }
  async onStart (app) {
    await super.onStart(app)
    await _loadServices(app, this)
  }
}

function _loadServices (app, MODULE) {
  util.find(MODULE.config.localPath, '.service.js', ({ filePath, fileName, dirPath }) => {
    const serviceName = _.camelCase(fileName)
    MODULE[serviceName] = require(filePath)(app)
    app.log(`\x1b[2m [local] ${serviceName}\x1b[0m\n`)
  })
}

module.exports = ServiceModule
