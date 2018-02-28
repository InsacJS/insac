class Module {
  constructor (moduleName, modulePath) {
    this.moduleName = moduleName.toUpperCase()
    this.modulePath = modulePath
  }
  async onSetup (app) {}
  async onStart (app) {}
}

module.exports = Module
