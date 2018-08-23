/** @ignore */ const express = require('express')
/** @ignore */ const https   = require('https')
/** @ignore */ const path    = require('path')

/** @ignore */ const config = require('./config/app.config')

/** @ignore */ const Apidoc   = require('./core/Apidoc')
/** @ignore */ const Database = require('./core/Database')
/** @ignore */ const Logger   = require('./core/Logger')

/** @ignore */ const util = require('./tools/util')

/**
* Clase principal, utilizada para controlar la aplicación.
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
    this.app = createServer(config)
  }

  /**
  * Adiciona un módulo a la aplicación.
  * @param {!String}  moduleName - Nombre del módulo.
  */
  addModule (moduleName) {
    const app          = this.getApp()
    moduleName         = moduleName.toLowerCase()
    const MODULE_NAME  = moduleName.toUpperCase()
    const MODULES_PATH = path.resolve(app.config.PATH.sources, 'modules')
    try {
      util.find(MODULES_PATH, `${moduleName}.module.js`, ({ filePath, dirPath }) => {
        if (app.modules[MODULE_NAME]) {
          app.logger.appError(`El módulo ${MODULE_NAME} ya ha sido definido`)
          process.exit(1)
        }
        const filesInfo = util.find(dirPath, `${moduleName}.config.js`)
        let moduleConfig = {}
        if (filesInfo.length > 0) {
          moduleConfig = require(filesInfo[0].filePath)
          app.logger.appPrimary('[archivo]', `${filesInfo[0].filePath.replace(app.config.PATH.project, '')} ${app.logger.OK}`)
        }
        moduleConfig.moduleName = MODULE_NAME
        moduleConfig.modulePath = dirPath
        app.config[MODULE_NAME] = moduleConfig
        app[MODULE_NAME]        = require(filePath)(app)
        app.modules.push(MODULE_NAME)
        app.logger.appPrimary('[archivo]', `${filePath.replace(app.config.PATH.project, '')} ${app.logger.OK}`)
        app.logger.appPrimary()
      })
    } catch (err) {
      app.logger.appError(`Ocurrió un error al adicionar el módulo '${MODULE_NAME}'. ${err.message}\n`)
      throw err
    }
  }

  /**
  * Configura, instala, carga y ejecuta la aplicación,
  * dependiendo del modo de ejecución.
  * @return {Promise}
  */
  async init () {
    const app = this.getApp()

    const SETUP  = app.config.DATABASE.setup
    const START  = app.config.SERVER.start
    const LISTEN = app.config.SERVER.listen

    try {
      app.loaded = false

      if (SETUP || START) {
        app.logger.appTitle('CONFIGURACIÓN INICIAL')
        await loadTools(app)
        await loadBeforeHooks(app)
        await app.apidoc.onInit(app)
        await app.DB.onInit(app)
        await initModules(app)
      }

      if (SETUP) {
        app.logger.appTitle('INSTALANDO APLICACIÓN')
        if (app.config.DATABASE.onSetup.dropDatabase)   await app.DB.dropDatabase(app)
        if (app.config.DATABASE.onSetup.createDatabase) await app.DB.createDatabase(app)
        await setupModules(app)

        app.logger.appAccent()
        app.logger.appAccent('La aplicación ha sido instalada con éxito.')
        app.logger.appAccent()

        if (!LISTEN) {
          await app.DB.sequelize.close()
        }
      }

      if (START)  {
        app.logger.appTitle('CARGANDO APLICACIÓN')
        await startModules(app)

        app.logger.appTitle('CONFIGURACIÓN FINAL')
        await loadAfterHooks(app)
        if (app.apidoc.isEnabled()) {
          await app.apidoc.build(app)
        }

        app.logger.appAccent()
        app.logger.appAccent('La aplicación ha sido cargada con éxito.')
        app.logger.appAccent()

        if (LISTEN) {
          app.logger.appTitle('EJECUTANDO APLICACIÓN')
          await listen(app)
        }
      }

      app.loaded = true
    } catch (err) {
      app.logger.appError('Error:', `Ocurrió un error al inicializar la aplicación. ${err.message}\n`)
      throw err
    }
  }

  /**
  * Cierra el servidor y la conexión con la base de datos.
  * @return  {Promise}
  */
  async close () {
    const app = this.getApp()
    if (app.SERVER) {
      await app.SERVER.close()
    }
    await app.DB.sequelize.close()
  }

  /**
  * Devuelve la instancia del servidor express.
  * @return {Function}
  */
  getApp () {
    return this.app
  }
}

/**
* @ignore
* Crea una instancia del servidor express.
* @param {!Object} config - Configuración de la aplicación.
* @return {Function}
*/
function createServer (config) {
  const app   = express()
  app.config  = config
  app.apidoc  = new Apidoc()
  app.DB      = new Database()
  app.logger  = new Logger(app)
  app.modules = [] // Para almacenar los nombres de los módulos
  app.getResourceModules = () => {
    const resourceModules = []
    app.modules.forEach(mod => {
      if (app[mod] && app[mod].hasComponent('resources', '.route.js')) { resourceModules.push(mod) }
    })
    return resourceModules
  }
  app.logger.appLogo(app)
  return app
}

/**
* @ignore
* Carga las herramientas o utilitarios generales de la aplicación.
* @param {!Object} app - Instancia del servidor express.
* @return {Function}
*/
async function loadTools (app) {
  const TOOLS_PATH = path.resolve(app.config.PATH.sources, 'tools')
  app.tools = {}
  if (util.isDir(TOOLS_PATH)) {
    await util.findAsync(TOOLS_PATH, '.tool.js', async ({ fileName, filePath }) => {
      app.tools[fileName] = await util.loadFile(app, filePath)
    })
  }
}

/**
* @ignore
* Carga los archivos de configuración (before hooks) que se requieren
* antes de cargar los módulos.
* @param {!Function} app - Instancia del servidor express.
*/
async function loadBeforeHooks (app) {
  const HOOKS_PATH  = path.resolve(app.config.PATH.sources, 'hooks')
  let appHookLoaded = false
  if (util.isDir(HOOKS_PATH)) {
    await util.findAsync(HOOKS_PATH, '.before.hook.js', async ({ filePath, fileName }) => {
      await require(filePath)(app)
      app.logger.appPrimary('[archivo]', `${filePath.replace(app.config.PATH.project, '')} ${app.logger.OK}`)
      if (fileName === 'app') appHookLoaded = true
    })
  }
  if (!appHookLoaded) {
    await require('./hooks/app.before.hook')(app)
    app.logger.appPrimary('[archivo]', `app.before.hook.js (default) ${app.logger.OK}`)
  }
}

/**
* @ignore
* Carga los archivos de configuración (after hooks) que se requieren
* después de cargar los módulos.
* @param {!Function} app - Instancia del servidor express.
*/
async function loadAfterHooks (app) {
  const HOOKS_PATH  = path.resolve(app.config.PATH.sources, 'hooks')
  let appHookLoaded = false
  if (util.isDir(HOOKS_PATH)) {
    await util.findAsync(HOOKS_PATH, '.after.hook.js', async ({ filePath, fileName }) => {
      await require(filePath)(app)
      app.logger.appPrimary('[archivo]', `${filePath.replace(app.config.PATH.project, '')} ${app.logger.OK}`)
      if (fileName === 'app') appHookLoaded = true
    })
  }
  if (!appHookLoaded) {
    await require('./hooks/app.after.hook')(app)
    app.logger.appPrimary('[archivo]', `app.after.hook.js (default) ${app.logger.OK}`)
  }
  app.logger.appPrimary()
}

/**
* @ignore
* Carga la configuración inicial de los módulos de la aplicación, para cada módulo:
*   1.- Carga los archivos de configuración (before hooks).
*   2.- Inicializa el módulo (onInit).
* @param {!Function} app - Instancia del servidor express.
*/
async function initModules (app) {
  for (let i in app.modules) {
    const MODULE_NAME = app.modules[i]
    app.logger.appTitle2(`Módulo ${MODULE_NAME} ...`)
    await app[MODULE_NAME].loadComponent(app, 'hooks', '.before.hook.js')
    await app[MODULE_NAME].onInit(app)
  }
}

/**
* @ignore
* Configura e instala los módulos de la aplicación.
* Dependiendo de la configuración, para cada módulo se realizan las siguientes tareas:
*   1.- Elimina el esquema de la base de datos asociado al módulo.
*   2.- Crea el esquema de la base de datos asociado al módulo.
*   3.- Configura el módulo (onSetup).
* @param {!Function} app - Instancia del servidor express.
*/
async function setupModules (app) {
  for (let i in app.modules) {
    const MODULE = app[app.modules[i]]
    if (app.config.DATABASE.onSetup.modules.length === 0 || app.config.DATABASE.onSetup.modules.includes(MODULE.getName())) {
      app.logger.appTitle2(`Módulo ${MODULE.getName()} ...`)
      if (MODULE.hasSetup()) {
        if (MODULE.config.schema && app.config.DATABASE.onSetup.dropSchemas)   await app.DB.dropSchema(app, MODULE)
        if (MODULE.config.schema && app.config.DATABASE.onSetup.createSchemas) await app.DB.createSchema(app, MODULE)
        await MODULE.onSetup(app)
      }
    }
  }
}

/**
* @ignore
* Inicializa los módulos de la aplicación, para cada módulo:
*   1.- Inicializa el módulo (onStart).
*   2.- Carga los archivos de configuración finales (after hooks).
* @param {!Function} app - Instancia del servidor express.
*/
async function startModules (app) {
  for (let i in app.modules) {
    const MODULE_NAME = app.modules[i]
    app.logger.appTitle2(`Módulo ${MODULE_NAME} ...`)
    await app[MODULE_NAME].onStart(app)
    await app[MODULE_NAME].loadComponent(app, 'hooks', '.after.hook.js')
  }
}

/**
* @ignore
* Despliega la aplicación.
* @param {!Function} app - Instancia del servidor express.
* @return {Promise}
*/
async function listen (app) {
  if (app.config.SERVER.https) {
    app.SERVER = await https.createServer(app.config.SERVER.httpsOptions, app).listen(app.config.SERVER.port)
  } else {
    app.SERVER = await app.listen(app.config.SERVER.port)
  }
  const URL = `${app.config.SERVER.protocol}://${app.config.SERVER.hostname}:${app.config.SERVER.port}`
  app.logger.appAccent(`[SERVICIO]`, `${URL} ${app.logger.OK}`)
  if (app.apidoc.isEnabled()) {
    app.getResourceModules().forEach(mod => {
      app.logger.appAccent(`[APIDOC]  `, `${URL}/apidoc/${mod} ${app.logger.OK}`)
    })
    app.logger.appAccent()
  }
  if (!app.apidoc.isEnabled()) {
    await app.apidoc.remove(app)
  }
}

module.exports = Insac
