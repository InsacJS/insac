const { Module } = require(global.INSAC)

module.exports = (app) => {
  const API =  new Module(app.config.API)

  return API
}
