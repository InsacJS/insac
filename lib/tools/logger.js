const { createLogger, format, transports } = require('winston')
const { printf } = format
const util = require('util')

/** @ignore */ const path    = require('path')
/** @ignore */ const fs      = require('fs')
/** @ignore */ const mkdirp  = require('mkdirp')
/** @ignore */ const moment  = require('moment')
/** @ignore */ const _       = require('lodash')

/** @ignore */ const DIRNAME  = 'logs'
/** @ignore */ const FILENAME = 'app.log'

/** @ignore */ const DIR_PATH  = path.resolve(process.cwd(), DIRNAME)
/** @ignore */ const FILE_PATH = path.resolve(DIR_PATH, FILENAME)

if (!fs.existsSync(DIR_PATH)) { mkdirp.sync(DIR_PATH) }

const myFormat = printf(info => {
  const TIMESTAMP = moment().format('DD/MM/YYYY HH:mm:ss')
  const LEVEL     = info.level
  const REQ_ID    = info.id
  const MESSAGE   = info.message
  const DATA      = info.data
  return `${TIMESTAMP} - ${REQ_ID} [${LEVEL}] ${MESSAGE}${DATA ? `\n${util.inspect(DATA, false, null)}` : ''}`
})

/**
* Herramienta para crear logs.
* @type {Logger}
*/
const logger = createLogger({
  format     : myFormat,
  transports : [
    new transports.File({
      level            : 'info',
      filename         : FILE_PATH,
      handleExceptions : false,
      json             : false,
      maxsize          : 5242880,
      maxFiles         : 5,
      colorize         : false
    })
  ],
  exitOnError: false
})

if (process.env.NODE_ENV && (process.env.NODE_ENV !== 'development')) {
  logger.remove(transports.Console)
}

/**
* Registra en un fichero de logs un error de tipo 500.
* @param {Request}              req - Objeto request.
* @param {ResponseHandlerError} err - Instancia de un error.
*/
function error500 (req, err) {
  const FECHA     = moment().format('DD/MM/YYYY HH:mm:ss')
  const METHOD    = req.method
  const PATH_NAME = req._parsedUrl.pathname
  const QUERY     = req._parsedUrl.search ? req._parsedUrl.search : ''
  const BODY      = `\n${JSON.stringify(req.body, null, 2)}`
  let message = `\n\n ${_.pad(' ERROR INTERNO ', 50, '\\')} \n\n`
  message += ` - FECHA      : ${FECHA}\n`
  message += ` - REQUEST ID : ${req.id}\n`
  message += ` - IP ORIGEN  : ${req.connection.remoteAddress}\n`
  message += ` - NAVEGADOR  : ${req.headers['user-agent']}\n`
  message += ` - URL        : [${METHOD}] ${PATH_NAME}\n`
  message += ` - QUERY      : ${QUERY}\n`
  message += ` - BODY       : ${BODY}\n`
  logger.log({ level: 'error', id: req.id, message, data: err })
}

/**
* Registra en un fichero de logs un error de tpo 4xx.
* @param {Request}              req - Objeto request.
* @param {ResponseHandlerError} err - Instancia de un error.
*/
function requestError (req, err) {
  let errors = ''
  err.errors.forEach(e => { errors += ` - ${e.msg}\n` })
  const message = `[STATUS] ${err.code} ${err.type}\n${errors}`
  logger.warn({ level: 'error', id: req.id, message })
}

module.exports = {
  info  : (req, message, data) => { logger.log({ level: 'info',  id: req.id, message, data }) },
  warn  : (req, message, data) => { logger.log({ level: 'warn',  id: req.id, message, data }) },
  error : (req, message, data) => { logger.log({ level: 'error', id: req.id, message, data }) },
  error500,
  requestError
}
