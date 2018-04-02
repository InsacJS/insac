/** @ignore */ const winston = require('winston')
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

/**
* Herramienta para crear logs.
* @type {Logger}
*/
const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      timestamp        : () => moment().format('DD/MM/YYYY HH:MM:SS'),
      level            : 'info',
      filename         : FILE_PATH,
      handleExceptions : false,
      json             : false,
      maxsize          : 5242880,
      maxFiles         : 5,
      colorize         : false
    }),
    new winston.transports.Console({
      level            : 'debug',
      handleExceptions : false,
      json             : false,
      colorize         : true
    })
  ],
  exitOnError: false
})

if (process.env.NODE_ENV && (process.env.NODE_ENV !== 'development')) {
  logger.remove(winston.transports.Console)
}

/** @ignore */ const GREY_COLOR   = '\x1b[2m'
/** @ignore */ const WHITE_COLOR  = '\x1b[0m'
/** @ignore */ const YELLOW_COLOR = '\x1b[33m'

/**
* Muestra la ruta de l request.
* @param {Request} req - Objeto request.
*/
logger.requestPath = (req) => {
  process.stdout.write(WHITE_COLOR)
  const METHOD    = req.method
  const PATH_NAME = req._parsedUrl.pathname
  const PATH      = `${_.padEnd(`[${METHOD}]`, 8, ' ')} ${PATH_NAME}\n`
  process.stdout.write(`\n${PATH}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra la query de un request.
* @param {Request} req - Objeto request.
*/
logger.requestQuery = (req) => {
  process.stdout.write(GREY_COLOR)
  const QUERY = req._parsedUrl.search ? `Query = ${req._parsedUrl.search}\n` : ''
  process.stdout.write(`${QUERY}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra el contenido del body de un request.
* @param {Request} req - Objeto request.
*/
logger.requestBody = (req) => {
  process.stdout.write(GREY_COLOR)
  const BODY = Object.keys(req.body).length > 0 ? `Body = ${JSON.stringify(req.body, null, 2)}\n` : ''
  process.stdout.write(`${BODY}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra los headers de un request.
* @param {Request} req - Objeto request.
*/
logger.requestHeaders = (req) => {
  process.stdout.write(GREY_COLOR)
  const HEADERS = Object.keys(req.headers).length > 0 ? `Headers = ${JSON.stringify(req.headers, null, 2)}\n` : ''
  process.stdout.write(`${HEADERS}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra un log por consola de una session.
* @param {Object} sesion - Datos de la sesion.
*/
logger.session = (sesion) => {
  process.stdout.write(YELLOW_COLOR)
  process.stdout.write(`[SESION] ${JSON.stringify(sesion)}\n`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra un log por consola de un error de tipo 500.
* @param {Request}              req - Objeto request.
* @param {ResponseHandlerError} err - Instancia de un error.
*/
logger.error500 = (req, err) => {
  logger.error('\n\n ' + _.pad(' ERROR INTERNO ', 50, '\\') + ' \n')
  const FECHA      = moment().format('DD/MM/YYYY HH:MM:SS')
  const METHOD     = req.method
  const PATH_NAME  = req._parsedUrl.pathname
  const QUERY      = req._parsedUrl.search ? req._parsedUrl.search : ''
  const BODY       = `\n${JSON.stringify(req.body, null, 2)}`
  let requestInfo = '\n\n'
  requestInfo += ` - FECHA     : ${FECHA}\n`
  requestInfo += ` - IP ORIGEN : ${req.connection.remoteAddress}\n`
  requestInfo += ` - NAVEGADOR : ${req.headers['user-agent']}\n`
  requestInfo += ` - URL       : [${METHOD}] ${PATH_NAME}\n`
  requestInfo += ` - QUERY     : ${QUERY}\n`
  requestInfo += ` - BODY      : ${BODY}\n`
  logger.error(requestInfo)
  logger.error(err, '')
}

module.exports = logger
