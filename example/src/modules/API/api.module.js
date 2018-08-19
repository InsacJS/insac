const { Module } = require(global.INSAC)

module.exports = (app) => {
  return new Module(app.config.API)
}
