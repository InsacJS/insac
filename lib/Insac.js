/** @ignore */ const express    = require('express')
/** @ignore */ const https      = require('https')
/** @ignore */ const cors       = require('cors')
/** @ignore */ const path       = require('path')
/** @ignore */ const _          = require('lodash')
/** @ignore */ const uuid       = require('uuid/v4')
/** @ignore */ const bodyParser = require('body-parser')
/** @ignore */ const Response   = require('response-handler').Response

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
    logger.app(`\x1b[32m`)
    logger.app(` |===============================================|`)
    logger.app(` |======  \x1b[33m I N S A C   F R A M E W O R K  \x1b[32m ======|`)
    logger.app(` |===============================================|\x1b[0m`)
    this.app.config  = config
    this.app.APIDOC  = new Apidoc(this.app)
    this.app.DB      = new Database(this.app)
    this.app.MODULES = []
    this.app.use(Response.error({ errorFormat: insacConfig.RESPONSE.errorFormat, onError: () => {} }))
    this.app.use(bodyParser.json())
    this.app.use(express.static(insacConfig.PATH.public))
    this.app.use(cors(config.SERVER.cors))
    this._setIndexPage(this.app)
  }

  /**
  * Adiciona un middleware para mostrar la página de inicio.
  * @param {Function} app - Instancia del servidor express.
  */
  _setIndexPage (app) {
    app.set('views', path.resolve(__dirname, 'views'))
    app.set('view engine', 'ejs')
    app.get('/', (req, res, next) => {
      const INFO   = this._getProjectInfo()
      INFO.modules = []
      app.MODULES.forEach(moduleName => {
        if (app[moduleName].config.moduleType === 'RESOURCE')  { INFO.modules.push(moduleName) }
      })
      res.render('index', INFO)
    })
  }

  /**
  * Devuelve la información del sistema.
  * @return {Object}
  */
  _getProjectInfo () {
    const INFO = {
      appName      : 'Sistema',
      appVersion   : '1.0.0',
      insacVersion : '1.0.0'
    }
    let insacPackagePath = path.resolve(insacConfig.PATH.project, 'node_modules/insac/package.json')
    let appPackagePath   = path.resolve(insacConfig.PATH.project, 'package.json')
    try { INFO.insacVersion = require(insacPackagePath).version } catch (e) {}
    try {
      const APP_PACKAGE_CONTENT = require(appPackagePath)
      INFO.appName    = _.upperFirst(_.replace(_.words(APP_PACKAGE_CONTENT.name).toString(), /,/g, ' '))
      INFO.appVersion = APP_PACKAGE_CONTENT.version
    } catch (e) {}
    return INFO
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
  * Instala, inicializa y activa el servidor de la aplicación,
  * dependiendo del modo de ejecución.
  * @return {Promise}
  */
  async init () {
    this.app.loaded = false
    try {
      await this._beforeHook(this.app)

      if (process.env.SETUP && (process.env.SETUP === 'true'))  {
        await this.app.DB.createSequelizeInstance()
        await this._setup(this.app)
        await this.app.DB.sequelize.close()
      }

      if (!process.env.START || (process.env.START === 'true'))  {
        await this.app.DB.createSequelizeInstance()
        await this._start(this.app)
        await this._listen(this.app)
      }

      await this._afterHook(this.app)
    } catch (err) {
      console.log(err)
      process.exit(0)
    }
    this.app.loaded = true
  }

  async close () {
    if (this.app.SERVER) { this.app.SERVER.close() }
    await this.app.DB.sequelize.close()
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
    logger.app('\x1b[2m')
    logger.app(' |===============================================|')
    logger.app(' |--------- \x1b[0m  INSTALANDO   APLICACIÓN \x1b[2m  ---------|')
    logger.app(' |===============================================|')
    logger.app('\x1b[0m')
    logger.app(` Sistema           : \x1b[2m${this._getProjectInfo().appName}\x1b[0m`)
    logger.app(` Modo de ejecución : \x1b[2m${config.SERVER.env}\x1b[0m\n`)
    const modules = process.env.MODULE ? process.env.MODULE.split(',') : []
    await app.DB.create()
    for (let i in app.MODULES) {
      const MODULE_NAME = app.MODULES[i]
      if ((modules.length === 0) || modules.includes(MODULE_NAME)) {
        logger.app(` Instalando Módulo ${MODULE_NAME} ... \n`)
        await app[MODULE_NAME].onSetup(app)
      }
    }
    logger.app(` Instalación finalizada correctamente.\n`)
  }

  /**
  * Inicializa todos los módulos secuencialmente.
  * @param {Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async _start (app) {
    logger.app('\x1b[2m')
    logger.app(' |===============================================|')
    logger.app(' |------- \x1b[0m  INICIALIZANDO   APLICACIÓN \x1b[2m  --------|')
    logger.app(' |===============================================|')
    logger.app('\x1b[0m')
    logger.app(` Sistema           : \x1b[2m${this._getProjectInfo().appName}\x1b[0m`)
    logger.app(` Modo de ejecución : \x1b[2m${config.SERVER.env}\x1b[0m\n`)
    for (let i in app.MODULES) {
      const MODULE_NAME = app.MODULES[i]
      logger.app(` Inicializando Módulo ${MODULE_NAME} ... \n`)
      await app[MODULE_NAME].onStart(app)
    }
    if (!process.env.APIDOC || process.env.APIDOC === 'true') {
      logger.app(` Creando APIDOC ... \n`)
      await app.APIDOC.build()
    }
    logger.app(` Aplicación inicializada exitosamente.\n`)
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
      app.SERVER = await app.listen(config.SERVER.port)
    }
    const URL = `${PROTOCOLO}://localhost:${config.SERVER.port}`
    logger.app(` \x1b[32m[listen]\x1b[0m\x1b[0m Servicio: ${URL}`)
    if (!process.env.APIDOC || process.env.APIDOC === 'true') {
      app.MODULES.forEach(mod => {
        if (app[mod].config.moduleType === 'RESOURCE') logger.app(` \x1b[32m[listen]\x1b[0m APIDOC:   ${URL}/apidoc/${mod}`)
      })
    }
    logger.app('')
    if (process.env.APIDOC && process.env.APIDOC === 'false') {
      app.APIDOC.remove()
    }
  }
}

module.exports = Insac
