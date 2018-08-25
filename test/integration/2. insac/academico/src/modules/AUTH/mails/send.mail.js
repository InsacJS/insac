const _      = require('lodash')
// const sgMail = require('@sendgrid/mail')
const { util } = require(global.INSAC)

module.exports = (app) => {
  const sgMail = { setApiKey: () => {}, send: () => { return 'OK' } }
  sgMail.setApiKey(app.config.AUTH.sendGridApiKey)

  const templates = {}
  util.find(app.AUTH.getPath('mails/templates'), '.mail.template.html', ({ fileName, filePath }) => {
    templates[fileName] = _.template(util.readFile(filePath))
  })

  const SEND = {}

  SEND.recordarPassword = async (urlReset, username, email, code) => {
    const DATA = {
      url_reset : urlReset,
      username  : username,
      code      : code
    }

    const MESSAGE = {
      from    : app.config.AUTH.header.system,
      to      : `<${email}>`,
      subject : 'Recuperación de contraseña',
      html    : templates.recordarPassword(DATA)
    }

    return sgMail.send(MESSAGE)
  }

  return SEND
}
