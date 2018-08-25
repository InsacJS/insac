const { Module } = require(global.INSAC)

module.exports = (app) => {
  const AUTH =  new Module(app.config.AUTH)

  AUTH.addComponent('mails', '.mail.js')
  AUTH.addComponent('reports', '.report.js')
  AUTH.addComponent('storage', '.storage.js')

  return AUTH
}
