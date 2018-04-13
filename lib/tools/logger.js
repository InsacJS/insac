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

// ansicolor: https://github.com/shiena/ansicolor/blob/master/README.md
/** @ignore */ const GREY_COLOR   = '\x1b[2m'
/** @ignore */ const WHITE_COLOR  = '\x1b[0m'
/** @ignore */ const LIGHT_GREEN_COLOR = '\x1b[92m'

/**
* Muestra por consola la ruta de una petición.
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
* Muestra por consola el contenido de la query de una petición.
* @param {Request} req - Objeto request.
*/
logger.requestQuery = (req) => {
  process.stdout.write(GREY_COLOR)
  const QUERY = req._parsedUrl.search ? `Query = ${req._parsedUrl.search}\n` : ''
  process.stdout.write(`${QUERY}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra por console el contenido del body de una petición.
* @param {Request} req - Objeto request.
*/
logger.requestBody = (req) => {
  process.stdout.write(GREY_COLOR)
  const BODY = Object.keys(req.body).length > 0 ? `Body = ${JSON.stringify(req.body, null, 2)}\n` : ''
  process.stdout.write(`${BODY}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra por consola el contenido de los headers de una petición.
* @param {Request} req - Objeto request.
*/
logger.requestHeaders = (req) => {
  process.stdout.write(GREY_COLOR)
  const HEADERS = Object.keys(req.headers).length > 0 ? `Headers = ${JSON.stringify(req.headers, null, 2)}\n` : ''
  process.stdout.write(`${HEADERS}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra por consola los datos de sesión de una petición.
* @param {!Object} session - Datos de la sesion.
*/
logger.session = (session) => {
  process.stdout.write(LIGHT_GREEN_COLOR)
  let SESSION = '[SESION] '
  if (session.usuario && session.usuario.id_usuario && session.usuario.nombre && session.usuario.roles) {
    SESSION += `- ID USUARIO: ${session.usuario.id_usuario} - ROLES: ${session.usuario.roles} - NOMBRE: ${session.usuario.nombre}`
  } else {
    SESSION = JSON.stringify(session)
  }
  process.stdout.write(SESSION + '\n')
  process.stdout.write(WHITE_COLOR)
}

if (process.env.NODE_ENV === 'production') {
  logger.requestPath    = () => {}
  logger.requestQuery   = () => {}
  logger.requestBody    = () => {}
  logger.requestHeaders = () => {}
  logger.session        = () => {}
}

/**
* Muestra por consola y registra en un fichero de logs un error de tipo 500.
* @param {Request}              req - Objeto request.
* @param {ResponseHandlerError} err - Instancia de un error.
*/
logger.error500 = (req, err) => {
  logger.error('\n\n ' + _.pad(' ERROR INTERNO ', 50, '\\') + ' \n')
  const FECHA     = moment().format('DD/MM/YYYY HH:MM:SS')
  const METHOD    = req.method
  const PATH_NAME = req._parsedUrl.pathname
  const QUERY     = req._parsedUrl.search ? req._parsedUrl.search : ''
  const BODY      = `\n${JSON.stringify(req.body, null, 2)}`
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
