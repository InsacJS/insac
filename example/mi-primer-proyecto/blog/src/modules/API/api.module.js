const { Module } = require('insac')

module.exports = (app) => {
  return new Module(app.config.API)
}
