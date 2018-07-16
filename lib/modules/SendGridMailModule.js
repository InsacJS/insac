/** @ignore */ const handlebars = require('handlebars')
/** @ignore */ const sgMail     = require('@sendgrid/mail')
/** @ignore */ const path       = require('path')
/** @ignore */ const Module     = require('../core/Module')
/** @ignore */ const util       = require('../tools/util')
/** @ignore */ const logger     = require('../tools/logger')

/**
* Módulo optimizado para gestionar el envío de emails.
*/
class SendGridMailModule extends Module {
  /**
  * Crea una instancia de la clase ResourceModule.
  * @param {Object} config - Configuración del módulo.
  */
  constructor (config = {}) {
    super(config, 'SENDGRID_MAIL')
    sgMail.setApiKey(this.config.sendGridApiKey)
    /**
    * Configuracion.
    * @type {Object}
    */
    this.config.mailsPath = this.config.mailsPath || path.resolve(this.config.modulePath, 'mails')
  }

  /**
  * Función que se ejecuta cuando se inicializa la aplicación.
  * @param {Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async onStart (app) {
    await super.onStart(app)
    await this._loadMails(app, this)
  }

  /**
  * Función encargada de cargar todos los archivos que contienen funciones para enviar emails.
  * @param {Function}       app    - Instancia del servidor express
  * @param {ResourceModule} MODULE - Instancia del módulo.
  */
  _loadMails (app, MODULE) {
    util.find(MODULE.config.mailsPath, '.mail.html', ({ filePath, fileName, dirPath }) => {
      const MAIL_PATH  = path.resolve(dirPath, `${fileName}.mail.js`)
      const getContent = require(MAIL_PATH)(app)
      const template   = handlebars.compile(util.readFile(filePath))
      if (MODULE[fileName]) {
        throw new Error(`El servicio de email ${fileName} ya se encuentra definido dentro del módulo ${MODULE.config.moduleName}.`)
      }
      MODULE[fileName] = (...args) => {
        const CONTENT = getContent(...args)
        const MSG     = {
          from    : CONTENT.from,
          to      : CONTENT.to,
          subject : CONTENT.subject,
          html    : template(CONTENT.data)
        }
        return this._sendMail(MSG)
      }
      logger.app(`\x1b[2m - [mail] ${fileName}\x1b[0m`)
    })
    logger.app('')
  }

  /**
  * Función que permite cargar todos los archivos de un recurso.
  * @param {Function} msg - Objeto que contiene los datos del email.
  * @return {Promise}
  */
  _sendMail (msg) {
    return new Promise((resolve, reject) => {
      return sgMail.send(msg).then(() => {
        resolve(` - Email enviado a: ${msg.to} \u2713`)
      }).catch(err => { reject(err) })
    })
  }
}

module.exports = SendGridMailModule
