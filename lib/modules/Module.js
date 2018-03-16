class Module {
  constructor (config) {
    this.config = config
  }
  async onSetup (app) {}
  async onStart (app) {}
}

module.exports = Module
