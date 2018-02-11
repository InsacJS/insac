class Module {
  constructor (app, CONFIG) {
    this.name = CONFIG.name
    this.path = CONFIG.path
  }

  async onSetup (app) {}

  async onStart (app) {}
}

module.exports = Module
