class Module {
  constructor (moduleName, modulePath) {
    this.config = {
      moduleName : moduleName.toUpperCase(),
      modulePath : modulePath
    }
  }
  async onSetup (app) {}
  async onStart (app) {}
}

module.exports = Module
