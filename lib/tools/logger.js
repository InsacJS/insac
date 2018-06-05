/** @ignore */ const _      = require('lodash')
/** @ignore */ const moment = require('moment')
/** @ignore */ const util   = require('util')
/** @ignore */ const path    = require('path')
/** @ignore */ const fs      = require('fs')
/** @ignore */ const mkdirp  = require('mkdirp')

/** @ignore */ const { createLogger, format, transports } = require('winston')
/** @ignore */ const { printf } = format

// ansicolor: https://github.com/shiena/ansicolor/blob/master/README.md
/** @ignore */ const GREY_COLOR         = '\x1b[2m'
/** @ignore */ const WHITE_COLOR        = '\x1b[0m'
/** @ignore */ const LIGHT_RED_COLOR    = '\x1b[91m'
/** @ignore */ const LIGHT_GREEN_COLOR  = '\x1b[92m'
/** @ignore */ const LIGHT_YELLOW_COLOR = '\x1b[93m'

/** @ignore */ const insacConfig = require('../config/insac.config')
/** @ignore */ const LOGS_PATH   = insacConfig.PATH.logs

if (!fs.existsSync(LOGS_PATH)) { mkdirp.sync(LOGS_PATH) }

/**
* Contiene los colores asociados a los diferentes niveles de logs.
* @type {Object}
*/
const COLORS = {
  error  : LIGHT_RED_COLOR,
  warn   : LIGHT_YELLOW_COLOR,
  info   : GREY_COLOR,
  trace  : WHITE_COLOR,
  notice : LIGHT_GREEN_COLOR
}

/**
* @ignore
* Devuelve una cadena de texto con formato personalizado para el log.
* @param {Object} info - Datos del log.
* @return {String}
*/
const consoleFormat = (info) => {
  const TIMESTAMP = insacConfig.LOGGER.console.timestamp ? `${moment().format('DD/MM/YYYY HH:mm:ss')} ` : ''
  const LEVEL     = info.level
  const LEVEL_STR = _.padEnd(`[${info.level}]`, 10, ' ')
  const REQ_ID    = insacConfig.LOGGER.console.reqId ? `${info.id || '------------------------------------'} ` : ''
  const MESSAGE   = info.message
  const DATA      = info.data ? util.inspect(info.data, false, null) : null
  return `${COLORS[LEVEL]}${TIMESTAMP}${REQ_ID}${LEVEL_STR} ${MESSAGE}${DATA ? `\n${DATA}` : ''}${WHITE_COLOR}`
}

/**
* @ignore
* Devuelve una cadena de texto con formato personalizado para el log.
* @param {Object} info - Datos del log.
* @return {String}
*/
const fileFormat = (info) => {
  const TIMESTAMP = moment().format('DD/MM/YYYY HH:mm:ss')
  const LEVEL   = info.level
  const REQ_ID  = info.id || '------------------------------------'
  const MESSAGE = info.message
  const DATA    = info.data ? util.inspect(info.data, false, null) : null
  return `${TIMESTAMP} ${REQ_ID} [${LEVEL}] ${MESSAGE}${DATA ? `\n${DATA}` : ''}`
}

const TRANSPORTS = []

if (insacConfig.LOGGER.console.enabled) {
  TRANSPORTS.push(new transports.Console({
    format           : printf(consoleFormat),
    level            : 'notice',
    handleExceptions : false,
    colorize         : false,
    json             : false
  }))
}

insacConfig.LOGGER.file.levels.forEach(levelName => {
  TRANSPORTS.push(new transports.File({
    format           : printf(fileFormat),
    level            : levelName,
    handleExceptions : false,
    colorize         : false,
    json             : false,
    filename         : path.resolve(LOGS_PATH, `app.${levelName}.log`),
    maxsize          : insacConfig.LOGGER.file.maxSize,
    maxFiles         : insacConfig.LOGGER.file.maxFiles
  }))
})

/**
* Herramienta para crear logs.
* @type {Logger}
*/
const winstonLogger = createLogger({
  levels      : { error: 0, warn: 1, info: 2, trace: 3, notice: 4 },
  transports  : TRANSPORTS,
  exitOnError : false
})

/**
* Objeto para crear logs.
* @type {Object}
*/
const logger = {
  error  : (req, message, data) => winstonLogger.error({ id: req ? req.id : null, message, data }),
  warn   : (req, message, data) => winstonLogger.warn({ id: req ? req.id : null, message, data }),
  info   : (req, message, data) => winstonLogger.info({ id: req ? req.id : null, message, data }),
  trace  : (req, message, data) => winstonLogger.trace({ id: req ? req.id : null, message, data }),
  notice : (req, message, data) => winstonLogger.notice({ id: req ? req.id : null, message, data }),
  app    : (!process.env.LOG || process.env.LOG === 'true') ? (message) => process.stdout.write(`${message}\n`) : () => {}
}

/**
* Muestra por consola la ruta de una petición.
* @param {Request} req - Objeto request.
*/
logger.requestPath = (req) => {
  const METHOD    = req.method
  const PATH_NAME = req._parsedUrl.pathname
  const MESSAGE   = `[${METHOD}] ${PATH_NAME}`
  logger.trace(req, MESSAGE)
}
if (insacConfig.LOGGER.include.request.path === false) { logger.requestPath = () => {} }

/**
* Muestra por consola el contenido de la query de una petición.
* @param {Request} req - Objeto request.
*/
logger.requestQuery = (req) => {
  const MESSAGE = `[QUERY] = ${req._parsedUrl.search}`
  if (req._parsedUrl.search) logger.info(req, MESSAGE)
}
if (insacConfig.LOGGER.include.request.query === false) { logger.requestQuery = () => {} }

/**
* Muestra por console el contenido del body de una petición.
* @param {Request} req - Objeto request.
*/
logger.requestBody = (req) => {
  const MESSAGE = `[BODY] = ${JSON.stringify(req.body, null, 2)}`
  if (Object.keys(req.body).length > 0) logger.info(req, MESSAGE)
}
if (insacConfig.LOGGER.include.request.body === false) { logger.requestBody = () => {} }

/**
* Muestra por consola el contenido de los headers de una petición.
* @param {Request} req - Objeto request.
*/
logger.requestHeaders = (req) => {
  const MESSAGE = `[HEADERS] = ${JSON.stringify(req.headers, null, 2)}`
  if (Object.keys(req.headers).length > 0) logger.info(req, MESSAGE)
}
if (insacConfig.LOGGER.include.request.headers === false) { logger.requestHeaders = () => {} }

/**
* Muestra por consola el contenido DATA de la respuesta a una petición.
* @param {Request}                req    - Objeto request.
* @param {ResponseHandlerSuccess} result - Resultado.
*/
logger.responseData = (req, result) => {
  const MESSAGE = `[DATA] = ${JSON.stringify(result.data || {}, null, 2)}`
  if (Object.keys(result.data || {}).length > 0) logger.notice(req, MESSAGE)
}
if (insacConfig.LOGGER.include.response.data === false) { logger.responseData = () => {} }

/**
* Muestra por consola el resultado de una peticion.
* @param {Request}                req    - Objeto request.
* @param {ResponseHandlerSuccess} result - Resultado.
*/
logger.responseCode = (req, result) => {
  const MESSAGE = `[STATUS] ${result.code} ${result.type}\n`
  logger.notice(req, MESSAGE)
}
if (insacConfig.LOGGER.include.response.code === false) { logger.responseCode = () => {} }

/**
* Muestra por consola errores de tipo 400.
* @param {Request}              req - Objeto request.
* @param {ResponseHandlerError} err - Instancia de un error.
*/
logger.error400 = (req, err) => {
  let errors = ''
  err.errors.forEach(e => { errors += ` - ${e.msg}\n` })
  const MESSAGE = `[STATUS] ${err.code} ${err.type}\n${errors}\n`
  logger.warn(req, MESSAGE)
}
if (insacConfig.LOGGER.include.error400 === false) { logger.error400 = () => {} }

/**
* Muestra por consola el error producido por un error de tipo 500.
* @param {Request}              req - Objeto request.
* @param {ResponseHandlerError} err - Instancia de un error.
*/
logger.error500 = (req, err) => {
  const FECHA     = moment().format('DD/MM/YYYY HH:mm:ss')
  const METHOD    = req.method
  const PATH_NAME = req._parsedUrl.pathname
  const QUERY     = req._parsedUrl.search ? req._parsedUrl.search : ''
  const BODY      = `\n${JSON.stringify(req.body, null, 2)}`
  let message = `\n ${_.pad(' ERROR INTERNO ', 50, '\\')} \n\n`
  message += ` - FECHA      : ${FECHA}\n`
  message += ` - REQUEST ID : ${req.id}\n`
  message += ` - IP ORIGEN  : ${req.connection.remoteAddress}\n`
  message += ` - NAVEGADOR  : ${req.headers['user-agent']}\n`
  message += ` - URL        : [${METHOD}] ${PATH_NAME}\n`
  message += ` - QUERY      : ${QUERY}\n`
  message += ` - BODY       : ${BODY}\n`
  const ERR = util.inspect(err, false, null)
  const MESSAGE = `[STATUS] ${err.code} ${err.type}\n${message}\n${ERR}\n`
  logger.error(req, MESSAGE)
}
if (insacConfig.LOGGER.include.error500 === false) { logger.error500 = () => {} }

/**
* Muestra por consola los datos de sesión de una petición, si los tuviera (req.session).
* @param {Request} req - Objeto request.
*/
logger.session = (req) => {
  if (req.session) {
    const MESSAGE = `[SESION] = ${JSON.stringify(req.session, null, 2)}`
    if (Object.keys(req.session).length > 0) logger.info(req, MESSAGE)
  }
}
if (insacConfig.LOGGER.include.session === false) { logger.session = () => {} }

module.exports = logger
