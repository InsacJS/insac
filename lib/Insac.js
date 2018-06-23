/** @ignore */ const express    = require('express')
/** @ignore */ const https      = require('https')
/** @ignore */ const cors       = require('cors')
/** @ignore */ const uuid       = require('uuid/v4')
/** @ignore */ const bodyParser = require('body-parser')
/** @ignore */ const Response   = require('response-handler').Response

/** @ignore */ const Loader      = require('./core/Loader')
/** @ignore */ const Apidoc      = require('./core/Apidoc')
/** @ignore */ const Database    = require('./core/Database')
/** @ignore */ const util        = require('./tools/util')
/** @ignore */ const logger      = require('./tools/logger')
/** @ignore */ const config      = require('./config/app.config')
/** @ignore */ const insacConfig = require('./config/insac.config')

/**
* Insac Framework
* Copyright(c) 2018 Alex Quispe
* MIT License
*/
class Insac {
  /**
  * Crea una instancia de la aplicación.
  */
  constructor () {
    /**
    * Instancia del servidor express.
    * @type {Function}
    */
    this.app = express()
    this.app.use((req, res, next) => { req.id = uuid(); return next() })
    logger.app(`\x1b[92m`)
    logger.app(` |===============================================|`)
    logger.app(` |======  \x1b[93m I N S A C   F R A M E W O R K \x1b[92m  ======|`)
    logger.app(` |===============================================|`)
    logger.app(`\x1b[0m`)
    this.app.config  = config
    this.app.APIDOC  = new Apidoc(this.app)
    this.app.DB      = new Database(this.app)
    this.app.MODULES = []
    this.app.use(Response.error({ errorFormat: insacConfig.RESPONSE.errorFormat, onError: () => {} }))
    this.app.use(bodyParser.json())
    this.app.use(express.static(insacConfig.PATH.public))
    this.app.use(cors(config.SERVER.cors))
  }

  /**
  * Adiciona un módulo.
  * @param {String}  moduleName           - Nombre del módulo.
  * @param {Object}  [options]            - Opciones de configuración del módulo.
  * @param {Boolean} [options.setup=true] - Indica si el módulo puede ser instalado.
  */
  addModule (moduleName, options = {}) {
    util.find(insacConfig.PATH.modules, '.module.js', ({ filePath, fileName, dirPath }) => {
      const MODULE_NAME = fileName.toUpperCase()
      if (MODULE_NAME === moduleName.toUpperCase()) {
        config[MODULE_NAME] = config[MODULE_NAME] || {}
        config[MODULE_NAME].moduleName = MODULE_NAME
        config[MODULE_NAME].modulePath = dirPath
        config[MODULE_NAME].setup      = options.setup
        this.app[MODULE_NAME] = require(filePath)(this.app)
        this.app.MODULES.push(MODULE_NAME)
      }
    })
  }

  /**
  * Instala o inicializa la aplicación, dependiendo del modo de ejecución.
  * @return {Promise}
  */
  async init () {
    try {
      this.app.loaded = false
      if (process.env.SETUP && process.env.SETUP === 'true') {
        await this._beforeHook(this.app)
        await this._setup(this.app)
        await this._afterHook(this.app)
        process.exit(0)
      }
      await this._beforeHook(this.app)
      await this._start(this.app)
      await this._afterHook(this.app)
      if (!process.env.LISTEN || (process.env.LISTEN === 'true')) {
        await this._listen(this.app)
      }
      this.app.loaded = true
    } catch (err) {
      if (err.name === 'SequelizeConnectionError') {
        logger.app(`Error de conexión con la base de datos.\n${err.message}.`)
        process.exit(0)
      }
      console.log(err)
      process.exit(0)
    }
  }

  /**
  * Carga todos los afterhooks.
  * @param {Function} app - Instancia del servidor express.
  */
  async _afterHook (app) {
    let defaultLoaded = false
    if (util.isDir(insacConfig.PATH.hooks)) {
      await util.findAsync(insacConfig.PATH.hooks, '.after.hook.js', async ({ filePath, fileName }) => {
        await require(filePath)(app)
        if (fileName === 'default') defaultLoaded = true
      })
    }
    if (!defaultLoaded) await require('./hooks/default.after.hook')(app)
  }

  /**
  * Carga todos los beforehooks.
  * @param {Function} app - Instancia del servidor express.
  */
  async _beforeHook (app) {
    let defaultLoaded = false
    if (util.isDir(insacConfig.PATH.hooks)) {
      await util.findAsync(insacConfig.PATH.hooks, '.before.hook.js', async ({ filePath, fileName }) => {
        await require(filePath)(app)
        if (fileName === 'default') defaultLoaded = true
      })
    }
    if (!defaultLoaded) await require('./hooks/default.before.hook')(app)
  }

  /**
  * Instala todos los módulos secuencialmente.
  * @param {Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async _setup (app) {
    logger.app('\x1b[2m |===============================================|')
    logger.app(' |--------- \x1b[0m  INSTALANDO   APLICACIÓN \x1b[2m  ---------|')
    logger.app(' |===============================================|\x1b[0m\n')
    logger.app(` Modo: ${config.SERVER.env}\n`)
    const modules = process.env.MODULE ? process.env.MODULE.split(',') : []
    await app.DB.create()
    for (let i in app.MODULES) {
      const MODULE_NAME = app.MODULES[i]
      if ((modules.length === 0) || modules.includes(MODULE_NAME)) {
        logger.app(` Módulo ${MODULE_NAME} ... \n`)
        await app[MODULE_NAME].onSetup(app)
        logger.app(`\n ${MODULE_NAME} \u2713 \n`)
      }
    }
    logger.app(` - Instalación finalizada correctamente.\n`)
  }

  /**
  * Inicializa todos los módulos secuencialmente.
  * @param {Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async _start (app) {
    logger.app('\x1b[2m |===============================================|')
    logger.app(' |------- \x1b[0m  INICIALIZANDO   APLICACIÓN \x1b[2m  --------|')
    logger.app(' |===============================================|\x1b[0m\n')
    logger.app(` Modo: ${config.SERVER.env}\n`)
    for (let i in app.MODULES) {
      const MODULE_NAME = app.MODULES[i]
      logger.app(` Módulo ${MODULE_NAME} ... \n`)
      await app[MODULE_NAME].onStart(app)
      logger.app(`\n ${MODULE_NAME} \u2713 \n`)
    }
    if (!process.env.APIDOC || process.env.APIDOC === 'true') {
      const task1 = new Loader(` Crear APIDOC`)
      task1.start()
      await app.APIDOC.build()
      task1.finish('\n')
    }
  }

  /**
  * Despliega la aplicación.
  * @param {Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async _listen (app) {
    const PROTOCOLO = (config.SERVER.https === true) ? 'https' : 'http'
    if (config.SERVER.https === true) {
      const options = config.SERVER.options || config.SERVER.ssl
      https.createServer(options, app).listen(config.SERVER.port)
    } else {
      app.listen(config.SERVER.port)
    }
    logger.app(` - Aplicación inicializada exitosamente.\n`)
    const URL = `${PROTOCOLO}://localhost:${config.SERVER.port}`
    logger.app(` - [service] ${URL}`)
    if (!process.env.APIDOC || process.env.APIDOC === 'true') {
      logger.app(` - [apidoc]  ${URL}/apidoc\n`)
    }
    if (process.env.APIDOC && process.env.APIDOC === 'false') {
      app.APIDOC.remove()
    }
  }
}

module.exports = Insac
