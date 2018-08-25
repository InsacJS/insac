const { Module } = require(global.INSAC)

module.exports = (app) => {
  const AUTH =  new Module(app.config.AUTH)

  return AUTH
}
