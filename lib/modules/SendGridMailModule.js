const handlebars = require('handlebars')
const sgMail     = require('@sendgrid/mail')
const path       = require('path')
const Module     = require('./Module')
const util       = require('../tools/util')

class SendGridMailModule extends Module {
  constructor (config = {}) {
    super(config)
    sgMail.setApiKey(this.config.sendGridApiKey)
    this.config.sendPath = this.config.sendPath || path.resolve(this.config.modulePath, 'send')
  }

  async onStart (app) {
    await super.onStart(app)
    await _loadSend(app, this)
  }
}

function _loadSend (app, MODULE) {
  MODULE.send = {}
  util.find(MODULE.config.sendPath, '.html', ({ filePath, fileName, dirPath }) => {
    const data     = require(path.resolve(dirPath, `${fileName}.data.js`))(app, MODULE.config)
    const HTML     = util.readFile(filePath)
    const template = handlebars.compile(HTML)
    MODULE.send[fileName] = (...args) => {
      const DATA = data(...args)
      const MSG  = {
        from    : DATA.header.from,
        to      : DATA.header.to,
        subject : DATA.header.subject,
        html    : template(DATA.body)
      }
      return _sendMail(MSG, MODULE.config.logger)
    }
    process.stdout.write(` [send] ${fileName}\n`)
  })
}

function _sendMail (msg, logger) {
  const stdout = ` - Email enviado a: ${msg.to} \u2713`
  const stderr = ` - Hubo un error al enviar el email a: ${msg.to}`
  return sgMail.send(msg).then(() => {
    if (logger) {
      logger.info(stdout)
    } else {
      console.log(stdout)
    }
  }).catch(error => {
    if (logger) {
      logger.error(error, '')
      logger.error(stderr)
    } else {
      console.error(error)
      console.error(stderr)
    }
  })
}

module.exports = SendGridMailModule
