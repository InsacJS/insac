/** @ignore */ const _      = require('lodash')
/** @ignore */ const moment = require('moment')
/** @ignore */ const util   = require('util')

// ansicolor: https://github.com/shiena/ansicolor/blob/master/README.md
/** @ignore */ const GREY_COLOR         = '\x1b[2m'
/** @ignore */ const WHITE_COLOR        = '\x1b[0m'
/** @ignore */ const LIGHT_RED_COLOR    = '\x1b[91m'
/** @ignore */ const LIGHT_GREEN_COLOR  = '\x1b[92m'
/** @ignore */ const LIGHT_YELLOW_COLOR = '\x1b[93m'

/**
* Objeto que contiene funciones que imprimen texto por consola.
* @type {Object}
*/
const stdout = {}

/**
* Muestra por consola la ruta de una petición.
* @param {Request} req - Objeto request.
*/
stdout.requestPath = (req) => {
  process.stdout.write(WHITE_COLOR)
  const REQ_ID    = req.id
  const METHOD    = req.method
  const PATH_NAME = req._parsedUrl.pathname
  const PATH      = `${REQ_ID} [${METHOD}] ${PATH_NAME}\n`
  process.stdout.write(`\n${PATH}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra por consola el contenido de la query de una petición.
* @param {Request} req - Objeto request.
*/
stdout.requestQuery = (req) => {
  const REQ_ID = req.id
  process.stdout.write(GREY_COLOR)
  const QUERY = req._parsedUrl.search ? `${REQ_ID} [QUERY] = ${req._parsedUrl.search}\n` : ''
  process.stdout.write(`${QUERY}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra por console el contenido del body de una petición.
* @param {Request} req - Objeto request.
*/
stdout.requestBody = (req) => {
  const REQ_ID = req.id
  process.stdout.write(GREY_COLOR)
  const BODY = Object.keys(req.body).length > 0 ? `${REQ_ID} [BODY] = ${JSON.stringify(req.body, null, 2)}\n` : ''
  process.stdout.write(`${BODY}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra por consola el contenido de los headers de una petición.
* @param {Request} req - Objeto request.
*/
stdout.requestHeaders = (req) => {
  const REQ_ID = req.id
  process.stdout.write(GREY_COLOR)
  const HEADERS = Object.keys(req.headers).length > 0 ? `${REQ_ID} [HEADERS] = ${JSON.stringify(req.headers, null, 2)}\n` : ''
  process.stdout.write(`${HEADERS}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra por consola el error producido en una petición.
* @param {Request}              req - Objeto request.
* @param {ResponseHandlerError} err - Instancia de un error.
*/
stdout.requestError = (req, err) => {
  const REQ_ID = req.id
  process.stdout.write(LIGHT_RED_COLOR)
  let errors = ''
  err.errors.forEach(e => { errors += ` - ${e.msg}\n` })
  const BODY = `${REQ_ID} [STATUS] ${err.code} ${err.type}\n${errors}\n`
  process.stdout.write(`${BODY}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra por consola los datos de sesión de una petición.
* @param {!Object} session - Datos de la sesion.
*/
stdout.session = (req, session) => {
  const REQ_ID = req.id
  process.stdout.write(LIGHT_YELLOW_COLOR)
  let SESSION = `${REQ_ID} [SESION] `
  if (session.usuario && session.usuario.id_usuario && session.usuario.nombre && session.usuario.roles) {
    SESSION += `ID USUARIO: ${session.usuario.id_usuario}  ROLES: ${session.usuario.roles}  NOMBRE: ${session.usuario.nombre}`
  } else {
    SESSION = JSON.stringify(session)
  }
  process.stdout.write(SESSION + '\n')
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra por consola el contenido DATA de la respuesta a una petición.
* @param {Object} data - Objeto DATA.
*/
stdout.responseData = (req, data = {}) => {
  const REQ_ID = req.id
  process.stdout.write(LIGHT_GREEN_COLOR)
  const DATA = Object.keys(data).length > 0 ? `${REQ_ID} [DATA] = ${JSON.stringify(data, null, 2)}\n` : ''
  process.stdout.write(`${DATA}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra por consola el resultado de una peticion.
* @param {ResponseHandlerSuccess} result - Resultado.
*/
stdout.responseCode = (req, result) => {
  const REQ_ID = req.id
  process.stdout.write(LIGHT_GREEN_COLOR)
  const CODE = `${REQ_ID} [STATUS] ${result.code} ${result.type}\n`
  process.stdout.write(`${CODE}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra por consola el error producido por un error de tipo 500.
* @param {Request}              req - Objeto request.
* @param {ResponseHandlerError} err - Instancia de un error.
*/
stdout.error500 = (req, err) => {
  const REQ_ID = req.id
  process.stdout.write(LIGHT_RED_COLOR)
  const FECHA     = moment().format('DD/MM/YYYY HH:mm:ss')
  const METHOD    = req.method
  const PATH_NAME = req._parsedUrl.pathname
  const QUERY     = req._parsedUrl.search ? req._parsedUrl.search : ''
  const BODY      = `\n${JSON.stringify(req.body, null, 2)}`
  let message = `\n${WHITE_COLOR} ${_.pad(' ERROR INTERNO ', 50, '\\')} \n\n`
  message += ` - FECHA      : ${FECHA}\n`
  message += ` - REQUEST ID : ${req.id}\n`
  message += ` - IP ORIGEN  : ${req.connection.remoteAddress}\n`
  message += ` - NAVEGADOR  : ${req.headers['user-agent']}\n`
  message += ` - URL        : [${METHOD}] ${PATH_NAME}\n`
  message += ` - QUERY      : ${QUERY}\n`
  message += ` - BODY       : ${BODY}\n`
  const ERR = util.inspect(err, false, null)
  const MESSAGE = `${REQ_ID} [STATUS] ${err.code} ${err.type}\n${message}\n${ERR}\n`
  process.stdout.write(`${MESSAGE}`)
  process.stdout.write(WHITE_COLOR)
}

/**
* Muestra por consola los logs de las consultas SQL.
* @param {String} sql Consulta SQL.
*/
stdout.sql = (sql) => {
  process.stdout.write(GREY_COLOR)
  process.stdout.write(`\n${sql}\n`)
  process.stdout.write(WHITE_COLOR)
}

if (process.env.NODE_ENV === 'production') {
  Object.keys(stdout).forEach(key => {
    stdout[key] = () => {}
  })
}

module.exports = stdout
