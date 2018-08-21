/** @ignore */ const _      = require('lodash')
/** @ignore */ const moment = require('moment')
/** @ignore */ const util   = require('util')
/** @ignore */ const path   = require('path')
/** @ignore */ const fs     = require('fs')
/** @ignore */ const mkdirp = require('mkdirp')

/** @ignore */ const { createLogger, format, transports } = require('winston')
/** @ignore */ const { printf } = format

/**
* Clase para crear logs.
*/
class Logger {
  /**
  * Crea una instancia de Logger.
  * @param {Function} app - Instancia del servidor express.
  */
  constructor (app) {
    /**
    * Configuración de la aplicación
    * @type {Object}
    */
    this.config = app.config

    // ansicolor: https://github.com/shiena/ansicolor/blob/master/README.md

    this.colors = {
      BLACK         : `\x1b[30m`,
      RED           : `\x1b[31m`,
      GREEN         : `\x1b[32m`,
      YELLOW        : `\x1b[33m`,
      BLUE          : `\x1b[34m`,
      MAGENTA       : `\x1b[35m`,
      CYAN          : `\x1b[36m`,
      LIGHT_GREY    : `\x1b[90m`,
      LIGHT_RED     : `\x1b[91m`,
      LIGHT_GREEN   : `\x1b[92m`,
      LIGHT_YELLOW  : `\x1b[93m`,
      LIGHT_BLUE    : `\x1b[94m`,
      LIGHT_MAGENTA : `\x1b[95m`,
      LIGHT_CYAN    : `\x1b[96m`,
      LIGHT_WHITE   : `\x1b[97m`
    }
    const colors = this.colors

    if (process.env.COLORS === 'false') {
      Object.keys(colors).forEach(key => { colors[key] = '' })
    }

    colors.WHITE = colors.LIGHT_WHITE

    const styles = {
      BOLD          : `\x1b[1m`,
      BOLD_OFF      : `\x1b[21m`,
      UNDERLINE     : `\x1b[4m`,
      UNDERLINE_OFF : `\x1b[24m`,
      BLINK         : `\x1b[5m`,
      BLINK_OFF     : `\x1b[25m`
    }

    colors.PRIMARY = `${styles.BOLD}${colors.LIGHT_BLUE}`
    colors.ACCENT  = `${styles.BOLD}${colors.LIGHT_WHITE}`

    colors.FATAL   = `${styles.BOLD}${colors.RED}`
    colors.ERROR   = `${styles.BOLD}${colors.LIGHT_RED}`
    colors.WARN    = `${styles.BOLD}${colors.LIGHT_YELLOW}`
    colors.NOTICE  = `${styles.BOLD}${colors.LIGHT_GREEN}`
    colors.INFO    = `${styles.BOLD}${colors.LIGHT_WHITE}`
    colors.VERBOSE = `${styles.BOLD}${colors.LIGHT_CYAN}`
    colors.DEBUG   = `${styles.BOLD}${colors.MAGENTA}`
    colors.SILLY   = `${styles.BOLD}${colors.BLUE}`

    colors.TEXT    = `${colors.LIGHT_WHITE}`

    colors.RESET   = `\x1b[0m`

    /**
    * Contiene los niveles de logs.
    * Basado en RFC 5424 - The Syslog Protocol - March 2009
    * Mas información: https://github.com/winstonjs/winston#logging-levels
    * @type {Object}
    */
    this.levels = { fatal: 0, error: 1, warn: 2, notice: 3, info: 4, verbose: 5, debug: 6, silly: 7 }

    /**
    * Contiene los colores asociados a los diferentes niveles de logs.
    * @type {Object}
    */
    this.levelColors = {
      fatal   : colors.RED,           // 0 Mensajes críticos
      error   : colors.LIGHT_RED,     // 1 Mensajes de error
      warn    : colors.LIGHT_YELLOW,  // 2 Mensajes de advertencia
      notice  : colors.LIGHT_GREEN,   // 3 Mensajes importantes
      info    : colors.LIGHT_WHITE,   // 4 Mensajes informativos
      verbose : colors.LIGHT_CYAN,    // 5 Mensajes detallados
      debug   : colors.MAGENTA,       // 6 Mensajes para el depurador
      silly   : colors.BLUE           // 7 Mensajes sin importancia
    }

    /**
    * Instancia de winston logger.
    * @type {WinstonLogger}
    */
    this.winstonLogger = createLogger({
      levels      : this.levels,
      transports  : createTransports(app, this),
      exitOnError : false
    })

    /**
    * Cadena de texto que representa un Ok.
    * @type {String}
    */
    this.OK   = `${colors.LIGHT_WHITE}${process.platform === 'linux' ? '\u2713' : ''}${colors.RESET}`

    /**
    * Cadena de texto que representa un Fail.
    * @type {String}
    */
    this.FAIL = `${colors.LIGHT_WHITE}${process.platform === 'linux' ? '\u2715' : 'x'}${colors.RESET}`

    createAppLoggerFunctions(this)
  }

  /**
  * Indica si los logs están habilitados.
  * @return {Boolean}
  */
  isEnabled () {
    return process.env.LOGGER === 'true'
  }

  /**
  * Muestra un mensaje del logo de la aplicación.
  * @param {!Function} app . Instancia del servidor express.
  */
  appLogo (app) {
    if (!this.isEnabled()) return
    const colors  = app.logger.colors
    const WIDTH   = 40
    const version = _.pad(`Versión ${app.config.PROJECT.insacVersion}`, WIDTH, ' ')
    let msg = '\n'
    msg += ` ${colors.PRIMARY} ${_.pad(`=====================================`, WIDTH, ' ')} ${colors.RESET}\n`
    msg += ` ${colors.PRIMARY} ${_.pad(`  ---------------------------------  `, WIDTH, ' ')} ${colors.RESET}\n`
    msg +=  ` ${colors.ACCENT} ${_.pad('    I N S A C   F R A M E W O R K    ', WIDTH, ' ')} ${colors.RESET}\n`
    msg += ` ${colors.PRIMARY} ${_.pad(`  =================================  `, WIDTH, ' ')} ${colors.RESET}\n`
    msg += ` ${colors.PRIMARY} ${_.pad(`-------------------------------------`, WIDTH, ' ')} ${colors.RESET}\n\n`
    msg += ` ${colors.ACCENT} ${version} ${colors.RESET}\n\n\n`
    msg += ` ${colors.NOTICE} Sistema :${colors.RESET}${colors.TEXT} ${app.config.PROJECT.appName}${colors.RESET}\n`
    msg += ` ${colors.NOTICE} Versión :${colors.RESET}${colors.TEXT} ${app.config.PROJECT.appVersion}${colors.RESET}\n`
    msg += ` ${colors.NOTICE} Entorno :${colors.RESET}${colors.TEXT} ${app.config.SERVER.env}${colors.RESET}\n\n\n`
    process.stdout.write(msg)
  }

  /**
  * Muestra el título principal de una tarea.
  * @param {String} title - Título principal.
  */
  appTitle (title) {
    if (!this.isEnabled()) return
    const colors = this.colors
    let msg = ''
    msg += `\n`
    msg += ` ${colors.ACCENT} ${title} ${colors.RESET}\n`
    msg += ` ${colors.PRIMARY} ${_.pad('', title.length, '=')} ${colors.RESET}\n`
    msg += `\n`
    process.stdout.write(msg)
  }

  /**
  * Muestra el título secundario de una tarea.
  * @param {String} title - Título secundario.
  */
  appTitle2 (title) {
    if (!this.isEnabled()) return
    const colors = this.colors
    process.stdout.write(`\n`)
    process.stdout.write(` ${colors.ACCENT} ${title} ${colors.RESET}\n`)
    process.stdout.write(`\n`)
  }

  /**
  * Muestra logs optimizados para informar el flujo de ejecución de la aplicación.
  * @param {String} level   - Nivel de log.
  * @param {String} title   - Título del mensaje.
  * @param {String} message - Mensaje.
  * @param {Object} data    - Información adicional (puede ser un objeto).
  */
  app (level = 'info', title = '', message = '', data = '') {
    const colors = this.colors
    if (!this.isEnabled()) return
    if (typeof title === 'string')   { title = ` ${title}` }     else { title = ` ${level}:` }
    if (typeof message === 'string') { message = ` ${message}` } else { message = `` }
    data = data ? (typeof data === 'string' ? data : require('util').inspect(data, { depth: null })) : ''
    if (data !== '') data = `\n${data}`
    const COLOR1 = colors[level.toUpperCase()]
    const COLOR2 = colors.TEXT
    process.stdout.write(` ${COLOR1}${title}${colors.RESET}${COLOR2}${message}${data}${colors.RESET}\n`)
  }

  /**
  * Muestra por consola la ruta de una petición.
  * @param {Request} req - Objeto request.
  */
  requestPath (req) {
    if (!this.isEnabled() || !this.config.LOGGER.include.request.path) return
    const METHOD    = req.method
    const PATH_NAME = req._parsedUrl.pathname
    const MESSAGE   = `[${METHOD}] ${PATH_NAME}`
    this.info(req, MESSAGE)
  }

  /**
  * Muestra por consola el contenido de los headers de una petición.
  * @param {Request} req - Objeto request.
  */
  inputHeaders (req) {
    if (!this.isEnabled() || !this.config.LOGGER.include.input.headers) return
    const MESSAGE = `[HEADERS] ${JSON.stringify(req.headers, null, 2)}`
    if (Object.keys(req.headers).length > 0) this.info(req, MESSAGE)
  }

  /**
  * Muestra por consola el contenido de la query de una petición.
  * @param {Request} req - Objeto request.
  */
  inputParams (req) {
    if (!this.isEnabled() || !this.config.LOGGER.include.input.params) return
    const MESSAGE = `[PARAMS] ${JSON.stringify(req.params)}`
    if (Object.keys(req.params).length > 0) this.info(req, MESSAGE)
  }

  /**
  * Muestra por consola el contenido de la query de una petición.
  * @param {Request} req - Objeto request.
  */
  inputQuery (req) {
    if (!this.isEnabled() || !this.config.LOGGER.include.input.query) return
    const MESSAGE = `[QUERY] ${req._parsedUrl.search}`
    if (req._parsedUrl.search) this.info(req, MESSAGE)
  }

  /**
  * Muestra por console el contenido del body de una petición.
  * @param {Request} req - Objeto request.
  */
  inputBody (req) {
    if (!this.isEnabled() || !this.config.LOGGER.include.input.body) return
    const MESSAGE = `[BODY] ${JSON.stringify(req.body, null, 2)}`
    if (Object.keys(req.body).length > 0) this.info(req, MESSAGE)
  }

  /**
  * Muestra por consola el contenido DATA de la respuesta a una petición.
  * @param {Request}         req    - Objeto request.
  * @param {ResponseSuccess} result - Resultado.
  */
  outputData (req, result) {
    if (!this.isEnabled() || !this.config.LOGGER.include.output.data) return
    const MESSAGE = `[DATA] ${JSON.stringify(result.data || {}, null, 2)}`
    if (Object.keys(result.data || {}).length > 0) this.info(req, MESSAGE)
  }

  /**
  * Muestra por consola el resultado de una peticion.
  * @param {Request}         req    - Objeto request.
  * @param {ResponseSuccess} result - Resultado.
  */
  responseSuccess (req, result) {
    if (!this.isEnabled() || !this.config.LOGGER.include.response.success) return
    const elapsedTime = (req.endAt - req.startAt) / 1000
    let contentLength = result && result.data ? Buffer.byteLength(JSON.stringify(result.data), 'UTF-8') / 1024 : 0
    contentLength = Math.round(contentLength * 100) / 100
    const MESSAGE = `[STATUS] ${result.code} ${result.type} (${elapsedTime} seg.) [data: ${contentLength} KB]`
    this.notice(req, MESSAGE)
  }

  /**
  * Muestra por consola errores de tipo 400.
  * @param {Request}       req - Objeto request.
  * @param {ResponseError} err - Instancia de un error.
  */
  responseError (req, err) {
    if (!this.isEnabled() || !this.config.LOGGER.include.response.error) return
    let errors = ''
    err.errors.forEach(e => { errors += `\n - ${e.msg}` })
    if (errors !== '') errors = `${errors}`
    const MESSAGE = `[STATUS] ${err.code} ${err.type}${errors}`
    this.warn(req, MESSAGE)
  }

  /**
  * Muestra por consola el error producido por un error de tipo 500.
  * @param {Request}       req - Objeto request.
  * @param {ResponseError} err - Instancia de un error.
  */
  responseError500 (req, err) {
    if (!this.isEnabled() || !this.config.LOGGER.include.response.error500) return
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
    const MESSAGE = `[STATUS] ${err.code} ${err.type}\n${message}\n${ERR}`
    this.error(req, MESSAGE)
  }
}

/**
* @ignore
* Crea una lista de transportes que utiliza WinstonLogger.
* @param {!Function}    app    - Instancia del servidor express.
* @param {!Logger}      logger - Instancia de logger.
* @return {Transport[]}
*/
function createTransports (app, logger) {
  const TRANSPORTS = []
  if (logger.isEnabled()) {
    TRANSPORTS.push(new transports.Console({
      format           : printf(consoleFormat(app)),
      level            : logger.config.LOGGER.console.transport.level,
      handleExceptions : false,
      colorize         : false,
      json             : logger.config.LOGGER.console.transport.json
    }))
  }

  const LOGS_PATH = logger.config.LOGGER.file.dirname || logger.config.PATH.logs

  logger.config.LOGGER.file.levels.forEach(levelName => {
    const LEVEL_PATH = path.resolve(LOGS_PATH, levelName)
    if (!fs.existsSync(LEVEL_PATH)) { mkdirp.sync(LEVEL_PATH) }
    TRANSPORTS.push(new transports.File({
      format           : printf(fileFormat(app)),
      level            : levelName,
      handleExceptions : false,
      colorize         : false,
      json             : logger.config.LOGGER.file.transport.json,
      filename         : path.resolve(LEVEL_PATH, `app.${levelName}.log`),
      maxsize          : logger.config.LOGGER.file.transport.maxsize,
      maxFiles         : logger.config.LOGGER.file.transport.maxFiles
    }))
  })
  return TRANSPORTS
}

/**
* @ignore
* Devuelve una cadena de texto con formato personalizado para los logs de la consola.
* @param {!Function} app - Instancia del servidor express.
* @return {String}
*/
function consoleFormat (app) {
  return (info) => {
    const RESULT = {
      timestamp : '',
      reqId     : '',
      level     : info.level,
      message   : info.message,
      data      : ''
    }
    if (info.data) {
      const dataSTR = util.inspect(info.data, false, null)
      if (dataSTR) { RESULT.data = `\n${dataSTR}` }
    }
    if (app.logger.config.LOGGER.console.timestamp) {
      RESULT.timestamp = `${moment().format('DD/MM/YYYY HH:mm:ss')} `
    }
    if (app.logger.config.LOGGER.console.reqId) {
      RESULT.reqId = `${info.id || _.pad('', 36, '-')} `
    }
    if (app.logger.config.LOGGER.console.transport.json) {
      return JSON.stringify(RESULT)
    }
    const LEVEL_STR = _.padEnd(`[${RESULT.level}]`, 10, ' ')
    return `${app.logger.levelColors[RESULT.level]}${RESULT.timestamp}${RESULT.reqId}${LEVEL_STR} ${RESULT.message}${RESULT.data}${app.logger.colors.RESET}`
  }
}

/**
* @ignore
* Devuelve una cadena de texto con formato personalizado para los logs de los ficheros.
* @param {!Function} app - Instancia del servidor express.
* @return {String}
*/
function fileFormat (app) {
  return (info)  => {
    const RESULT = {
      timestamp : moment().format('DD/MM/YYYY HH:mm:ss'),
      reqId     : info.id || _.pad('', 36, '-'),
      level     : info.level,
      message   : info.message,
      data      : ''
    }
    if (info.data) {
      const dataSTR = util.inspect(info.data, false, null)
      if (dataSTR) { RESULT.data = `\n${dataSTR}` }
    }
    if (app.logger.config.LOGGER.file.transport.json) {
      return JSON.stringify(RESULT)
    }
    return `${RESULT.timestamp} ${RESULT.reqId} [${RESULT.level}] ${RESULT.message}${RESULT.data}`
  }
}

/**
* @ignore
* Adiciona funciones personalizadas para todos los niveles de logs soportados.
* @param {!Logger} logger - Instancia de logger.
* @return {String}
*/
function createAppLoggerFunctions (logger) {
  const IS_ENABLED = logger.isEnabled()
  Object.keys(logger.levels).forEach(level => {
    // Logger para cualquier situación.
    logger[level] = (req, message, data) => {
      if (!IS_ENABLED) return
      logger.winstonLogger[level]({ id: req ? req.id : null, message, data })
    }
    // Logger para el framework.
    const functionName = `app${_.upperFirst(level)}`
    logger[functionName] = (...args) => {
      if (!IS_ENABLED) return
      logger.app(level, ...args)
    }
  })
}

module.exports = Logger
