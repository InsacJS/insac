const handlebars = require('handlebars')
const sgMail     = require('@sendgrid/mail')
const path       = require('path')
const Module     = require('./Module')
const util       = require('../tools/util')
const logger     = require('../tools/logger')

class EmailSendGridModule extends Module {
  constructor (moduleName, modulePath, config = {}) {
    super(moduleName, modulePath)
    sgMail.setApiKey(config.SENDGRID_API_KEY)
    this.config = config
    this.config.sendPath = config.sendPath || path.resolve(modulePath, 'send')
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
      return _sendMail(MSG)
    }
    process.stdout.write(` [send] ${fileName}\n`)
  })
}

function _sendMail (msg) {
  return sgMail.send(msg).then(() => {
    logger.info(` - Email enviado a: ${msg.to} \u2713`)
  }).catch(error => {
    logger.error(error, '')
    logger.error(` - Hubo un error al enviar el email a: ${msg.to}`)
  })
}

module.exports = EmailSendGridModule
