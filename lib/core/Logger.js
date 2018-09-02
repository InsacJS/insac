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
    * Configuración de la aplicación.
    * @type {Object}
    */
    this.config = app.config

    /**
    * Colores para los logs.
    * @type {Object}
    */
    this.colors = {}

    /**
    * Estilos para los logs.
    * @type {Object}
    */
    this.styles = {}

    /**
    * Contiene los niveles de logs.
    * @type {Object}
    */
    this.levels = {}

    /**
    * Contiene los colores asociados a los diferentes niveles de logs.
    * @type {Object}
    */
    this.levelColors = {}

    /**
    * Instancia de winston logger.
    * @type {WinstonLogger}
    */
    this.winstonLogger = null

    /**
    * Cadena de texto que representa un Ok.
    * @type {String}
    */
    this.OK = ''

    /**
    * Cadena de texto que representa un Fail.
    * @type {String}
    */
    this.FAIL = ''

    this.init(app)
  }

  /**
  * Inicializa las propiedades.
  * @param {Function} app
  */
  init (app) {
    const colors = this.colors = {}

    // Colores básicos
    // ansicolor: https://github.com/shiena/ansicolor/blob/master/README.md
    colors.BLACK         = `\x1b[30m`
    colors.RED           = `\x1b[31m`
    colors.GREEN         = `\x1b[32m`
    colors.YELLOW        = `\x1b[33m`
    colors.BLUE          = `\x1b[34m`
    colors.MAGENTA       = `\x1b[35m`
    colors.CYAN          = `\x1b[36m`
    colors.LIGHT_GREY    = `\x1b[90m`
    colors.LIGHT_RED     = `\x1b[91m`
    colors.LIGHT_GREEN   = `\x1b[92m`
    colors.LIGHT_YELLOW  = `\x1b[93m`
    colors.LIGHT_BLUE    = `\x1b[94m`
    colors.LIGHT_MAGENTA = `\x1b[95m`
    colors.LIGHT_CYAN    = `\x1b[96m`
    colors.LIGHT_WHITE   = `\x1b[97m`

    if (process.env.COLORS === 'false') {
      Object.keys(colors).forEach(key => { colors[key] = '' })
    }
    colors.RESET   = `\x1b[0m`
    colors.WHITE = colors.LIGHT_WHITE

    const styles = this.styles = {}

    // Estilos básicos
    styles.BOLD          = `\x1b[1m`
    styles.BOLD_OFF      = `\x1b[21m`
    styles.UNDERLINE     = `\x1b[4m`
    styles.UNDERLINE_OFF = `\x1b[24m`
    styles.BLINK         = `\x1b[5m`
    styles.BLINK_OFF     = `\x1b[25m`

    styles.RESET   = `\x1b[0m`

    // Colores del sistema
    colors.PRIMARY = `${styles.BOLD}${colors.LIGHT_BLUE}`
    colors.ACCENT  = `${styles.BOLD}`
    colors.TEXT    = `${colors.RESET}`

    colors.FATAL   = `${styles.BOLD}${colors.RED}`
    colors.ERROR   = `${styles.BOLD}${colors.LIGHT_RED}`
    colors.WARN    = `${styles.BOLD}${colors.LIGHT_YELLOW}`
    colors.NOTICE  = `${styles.BOLD}${colors.LIGHT_GREEN}`
    colors.INFO    = `${styles.BOLD}${colors.LIGHT_WHITE}`
    colors.VERBOSE = `${styles.BOLD}${colors.LIGHT_CYAN}`
    colors.DEBUG   = `${styles.BOLD}${colors.LIGHT_BLUE}`
    colors.SILLY   = `${styles.BOLD}${colors.LIGHT_MAGENTA}`

    const LEVELS = this.levels = {}

    LEVELS.fatal   = 0 // Mensajes críticos
    LEVELS.error   = 1 // Mensajes de error
    LEVELS.warn    = 2 // Mensajes de advertencia
    LEVELS.notice  = 3 // Mensajes importantes
    LEVELS.info    = 4 // Mensajes informativos
    LEVELS.verbose = 5 // Mensajes detallados
    LEVELS.debug   = 6 // Mensajes para el depurador
    LEVELS.silly   = 7 // Mensajes sin importancia

    this.levelColors = {
      fatal   : colors.RED,
      error   : colors.LIGHT_RED,
      warn    : colors.LIGHT_YELLOW,
      notice  : colors.LIGHT_GREEN,
      info    : colors.RESET,
      verbose : colors.LIGHT_CYAN,
      debug   : colors.LIGHT_BLUE,
      silly   : colors.LIGHT_MAGENTA
    }

    this.winstonLogger = createLogger({
      levels      : LEVELS,
      transports  : createTransports(app, this),
      exitOnError : false
    })

    this.OK   = `${colors.TEXT}${process.platform === 'linux' ? '\u2713' : ''}${colors.RESET}`
    this.FAIL = `${colors.TEXT}${process.platform === 'linux' ? '\u2715' : 'x'}${colors.RESET}`

    createLoggerFunctions(this)
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
    msg += ` ${colors.PRIMARY}Sistema :${colors.RESET} ${colors.TEXT}${app.config.PROJECT.appName}${colors.RESET}\n`
    msg += ` ${colors.PRIMARY}Versión :${colors.RESET} ${colors.TEXT}${app.config.PROJECT.appVersion}${colors.RESET}\n`
    msg += ` ${colors.PRIMARY}Entorno :${colors.RESET} ${colors.TEXT}${app.config.SERVER.env}${colors.RESET}\n\n\n`
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
    msg += ` ${colors.ACCENT}${title}${colors.RESET}\n`
    msg += ` ${colors.PRIMARY}${_.pad('', title.length, '=')}${colors.RESET}\n`
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
    process.stdout.write(` ${colors.ACCENT}${title}${colors.RESET}\n`)
    process.stdout.write(`\n`)
  }

  /**
  * Para imprimir mensajes con el color Primary.
  * @param {String} title   - Título.
  * @param {String} message - Mensaje.
  * @param {Object} data    - Datos adicionales.
  */
  appPrimary (title = '', message = '', data = '') {
    if (!this.isEnabled()) return
    title = typeof title === 'string' ? title : ''
    const colors = this.colors
    const C1 = colors.PRIMARY
    const C2 = colors.TEXT
    const C3 = colors.TEXT
    const RT = colors.RESET
    process.stdout.write(` ${C1}${title}${RT} ${C2}${message}${RT} ${C3}${data}${RT}\n`)
  }

  /**
  * Para imprimir mensajes con el color Accent.
  * @param {String} title   - Título.
  * @param {String} message - Mensaje.
  * @param {Object} data    - Datos adicionales.
  */
  appAccent (title = '', message = '', data = '') {
    if (!this.isEnabled()) return
    title = typeof title === 'string' ? title : ''
    const colors = this.colors
    const styles = this.styles
    const C1 = colors.ACCENT
    const C2 = colors.TEXT
    const C3 = colors.TEXT
    const RT = `${colors.RESET}${styles.RESET}`
    process.stdout.write(` ${C1}${title}${RT} ${C2}${message}${RT} ${C3}${data}${RT}\n`)
  }

  /**
  * Para imprimir mensajes con el color Error.
  * @param {String} title   - Título.
  * @param {String} message - Mensaje.
  * @param {Object} data    - Datos adicionales.
  */
  appError (title = '', message = '', data = '') {
    if (!this.isEnabled()) return
    title = typeof title === 'string' ? title : ''
    const colors = this.colors
    const C1 = colors.ERROR
    const C2 = colors.TEXT
    const C3 = colors.TEXT
    const RT = colors.RESET
    process.stdout.write(` ${C1}${title}${RT} ${C2}${message}${RT} ${C3}${data}${RT}\n`)
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

  const LOGS_PATH = logger.config.PATH.logs

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
function createLoggerFunctions (logger) {
  const IS_ENABLED = logger.isEnabled()
  Object.keys(logger.levels).forEach(level => {
    logger[level] = (req, message, data) => {
      if (!IS_ENABLED) return
      logger.winstonLogger[level]({ id: req ? req.id : null, message, data })
    }
  })
}

module.exports = Logger
