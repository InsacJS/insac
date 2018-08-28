/** @ignore */ const _      = require('lodash')
/** @ignore */ const path   = require('path')

/** @ignore */ const util   = require('../tools/util')

/** @ignore */ const FieldCreator = require('../libs/FieldCreator')

/**
* Modelo base para crear módulos.
*/
class Module {
  /**
  * Crea una instancia de la clase Module
  * @param {!Object} config - Configuración del módulo.
  */
  constructor (config) {
    /**
    * Configuración del módulo.
    * @type {Object}
    */
    this.config               = config
    this.config.moduleName    = config.moduleName
    this.config.modulePath    = config.modulePath
    this.config.setup         = (typeof config.setup === 'boolean') ? config.setup : true
    if (typeof this.config.schema === 'undefined') {
      this.config.schema = this.hasComponent('models', '.model.js') ? this.getName().toLowerCase() : null
    }

    /**
    * Longitud máxima del nombre de los modelos.
    * @type {Number}
    */
    this._max = 0

    /**
    * Componentes personalizados.
    * @type {Object[]} components
    * @property {!String} components.dirName                 - Nombre de la carpeta.
    * @property {!String} components.fileExt                 - Extensión del archivo principal.
    * @property {Object} [components.options]                - Opciones del componente.
    * @property {Boolean} [components.options.onInit=true]   - Indica si se va a cargar al inicializar el módulo.
    * @property {Boolean} [components.options.onSetup=false] - Indica si se va a cargar al instalar el módulo.
    * @property {Boolean} [components.options.onStart=true]  - Indica si se va a cargar al cargar el módulo.
    */
    this.components = []

    /**
    * Función que se ejecuta despues de Inicializar el módulo.
    * @type {AsyncFunction}
    */
    this.actionOnInit = null

    /**
    * Función que se ejecuta despues de Instalar el módulo.
    * @type {AsyncFunction}
    */
    this.actionOnSetup = null

    /**
    * Función que se ejecuta despues de Cargar el módulo.
    * @type {AsyncFunction}
    */
    this.actionOnStart = null
  }

  /**
  * Se ejecuta al inicializar el módulo.
  * @param {!Functon} app - Instancia del servidor express.
  * @return {Promise}
  */
  async onInit (app) {
    const MODULE = this
    await MODULE.loadComponent(app, 'tools', '.tool.js')
    await MODULE.loadComponent(app, 'models', '.model.js', ({ fileName, filePath }) => {
      const key = fileName
      const val = importModel(app, MODULE, filePath)
      return { key, val }
    })
    if (Object.keys(MODULE.models).length > 0) app.logger.appPrimary()
    app.DB.associateModels(app, MODULE)

    await MODULE.loadCustomComponents(app, 'onInit')
    if (this.actionOnInit) await this.actionOnInit()
  }

  /**
  * Se ejecuta cuando se instala la aplicación.
  * @param {!Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async onSetup (app) {
    const MODULE = this

    if (MODULE.getSchema() && app.config.DATABASE.onSetup.dropSchemas)   await app.DB.dropSchema(app, MODULE)
    if (MODULE.getSchema() && app.config.DATABASE.onSetup.createSchemas) await app.DB.createSchema(app, MODULE)

    const MODELS_PATH = MODULE.getPath('models')
    if (util.isDir(MODELS_PATH) && util.countFiles(MODELS_PATH, '.model.js') > 0) {
      if (app.config.DATABASE.onSetup.dropTables)   await app.DB.dropTables(app, MODULE)
      if (app.config.DATABASE.onSetup.createTables) await app.DB.createTables(app, MODULE)
    }

    const SEEDERS_PATH = MODULE.getPath('seeders')
    if (util.isDir(SEEDERS_PATH) && util.countFiles(SEEDERS_PATH, '.seed.js') > 0) {
      if (app.config.DATABASE.onSetup.createSeeders) await app.DB.createSeeders(app, MODULE)
    }

    await MODULE.loadCustomComponents(app, 'onSetup')
    if (this.actionOnSetup) await this.actionOnSetup()
  }

  /**
  * Se ejecuta al cargar el módulo.
  * @param {!Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async onStart (app) {
    const MODULE = this

    await MODULE.loadComponent(app, 'dao', '.dao.js')
    await MODULE.loadComponent(app, 'resources', '.route.js', async (info) => {
      const key = info.dirPath.replace(MODULE.getPath(), '')
      const val = await loadResource(app, MODULE, info)
      return { key, val }
    })

    await MODULE.loadCustomComponents(app, 'onStart')
    if (this.actionOnStart) await this.actionOnStart()
  }

  /**
  * Carga todos los componentes personalizados.
  * @param {Function} app                                      - Instancia del servidor express.
  * @param {!String} [loadOption='onInit','onSetup','onStart'] - Opción de cargado.
  */
  async loadCustomComponents (app, loadOption) {
    const MODULE = this
    for (let i in MODULE.components) {
      if (MODULE.components[i].options[loadOption]) {
        const dirName = MODULE.components[i].dirName
        const fileExt = MODULE.components[i].fileExt
        await MODULE.loadComponent(app, dirName, fileExt)
      }
    }
  }

  /**
  * Adiciona un componente personalizado al módulo.
  * @param {!String} dirName                 - Nombre de la carpeta.
  * @param {!String} fileExt                 - Extensión del archivo principal.
  * @param {Object} [options]                - Opciones del componente.
  * @param {Boolean} [options.onInit=true]   - Indica si se va a cargar al inicializar el módulo.
  * @param {Boolean} [options.onSetup=false] - Indica si se va a cargar al instalar el módulo.
  * @param {Boolean} [options.onStart=true]  - Indica si se va a cargar al cargar el módulo.
  */
  addComponent (dirName, fileExt, options = {}) {
    options.onInit  = typeof options.onInit === 'boolean' ? options.onInit : false
    options.onSetup = typeof options.onSetup === 'boolean' ? options.onSetup : false
    options.onStart = typeof options.onStart === 'boolean' ? options.onStart : true
    this.components.push({ dirName, fileExt, options })
  }

  /**
  * Adiciona una función para que se ejecute en un determinado momento.
  * @param {!String}        [type='onStart'] - Tipo de evento (onInit, onSetup, onStart).
  * @param {!AsyncFunction} action           - Función de tipo asincrono
  */
  addAction (type, action) {
    if (type === 'onInit')  this.actionOnInit  = action
    if (type === 'onSetup') this.actionOnSetup = action
    if (type === 'onStart') this.actionOnStart = action
  }

  /**
  * Carga un componente al módulo.
  * @param {!Functon}      app      - Instancia del servidor express.
  * @param {!String}       dirName  - Nombre de la carpeta.
  * @param {!String}       fileExt  - Extensión del fichero principal del componente.
  * @param {AsyncFunction} [onFind] - Función para personalizar el cargado del componente.
  *                                   Opcionalmente puede devolver una objeto que contiene una clave y un valor.
  *                                   que se utilizaran para identificar a los ficheros.
  * @return {Promise}
  */
  async loadComponent (app, dirName, fileExt, onFind) {
    const MODULE    = this
    const dirPath   = MODULE.getPath(dirName)
    MODULE[dirName] = {}
    if (util.isDir(dirPath)) {
      let fileLoaded = false
      await util.findAsync(dirPath, fileExt, async (info) => {
        const result = onFind ? ((await onFind(info)) || {}) : {}
        const key    = info.fileName
        let val      = result.val
        if (!result.val) {
          val        = await util.loadFile(app, info.filePath)
          fileLoaded = true
        }
        MODULE[dirName][key] = val
      })
      if (fileLoaded) app.logger.appPrimary()
    }
    return MODULE[dirName]
  }

  /**
  * Devuelve el contenido de un archivo, alternativamente, es posible ejecutar
  * su contenido si se trata de una función devolviendo en todo caso el resultado de dicha función.
  *
  * Ejemplo 1.-
  * module.exports = (app) => {
  *   const data = {}
  *   return data
  * }
  *
  * Ejemplo 2 .-
  * const data = {}
  * module.exports = data
  *
  * @param {String} app      - Instancia del servidor, es para mostrar los logs.
  * @param {String} filePath - Ruta del archivo.
  * @return {Object} data
  */
  async loadFile (app, filePath) { return util.loadFile(app, filePath) }

  /**
  * Devuelve el nombre del módulo.
  * @return {String}
  */
  getName () { return this.config.moduleName }

  /**
  * Devuelve el nombre del esquema asociado al módulo.
  * @return {String}
  */
  getSchema () { return this.config.schema }

  /**
  * Indica si es posible instalar el módulo.
  * @return {Boolean}
  */
  hasSetup () { return this.config.setup }

  /**
  * Devuelve la ruta absoluta del módulo.
  * @param {String} [relativePath] - Ruta relativa respecto al módulo.
  * @return {String}
  */
  getPath (relativePath = '') { return path.resolve(this.config.modulePath) }
  /**
  * Indica si existen elementos de un determinado componente del módulo.
  * @param {!String} dirName - Nombre de la carpeta (componente).
  * @param {!String} fileExt - Extensión del fichero principal del componente.
  * @return {Boolean}
  */
  hasComponent (dirName, fileExt) {
    const COMPONENT_PATH = this.getPath(dirName)
    return COMPONENT_PATH && util.countFiles(COMPONENT_PATH, fileExt) > 0
  }
}

/**
* @ignore
* Importa un modelo Sequelize.
* @param {!Function} app      - Instancia del servidor express.
* @param {!Module}   MODULE   - Instancia del módulo.
* @param {!String}   filePath - Ruta del modelo.
* @return {SequelizeModel}
*/
function importModel (app, MODULE, filePath) {
  try {
    const MODEL = app.DB.importModel(app, MODULE, filePath)
    app.logger.appPrimary('[archivo]', `${filePath.replace(app.config.PATH.project, '')} ${app.logger.OK}`)
    return MODEL
  } catch (e) {
    app.logger.appError('[archivo]', `${filePath.replace(app.config.PATH.project, '')} ${app.logger.FAIL}\n`)
    throw e
  }
}

/**
* @ignore
* Devuelve el contenido de un recurso.
* @param {!Function} app      - Instancia del servidor express.
* @param {!Module}   MODULE   - Instancia del Módulo.
* @param {!Object}   fileInfo - Información del fichero principal del componente (example.route.js).
* @return {Object}
*/
async function loadResource (app, MODULE, { filePath, fileName, dirPath }) {
  const RESOURCE      = await util.loadFile(app, filePath)
  const INPUT         = await util.loadFile(app, path.resolve(dirPath, `${fileName}.input.js`))
  const OUTPUT        = await util.loadFile(app, path.resolve(dirPath, `${fileName}.output.js`))
  const MIDDLEWARE    = await util.loadFile(app, path.resolve(dirPath, `${fileName}.middleware.js`))
  const CONTROLLER    = await util.loadFile(app, path.resolve(dirPath, `${fileName}.controller.js`))
  const RESOURCE_MAME = fileName
  const MODULE_NAME   = MODULE.getName()
  let   pathSize      = 0
  const HAS_RESOURCES = Object.keys(RESOURCE).length > 0
  Object.keys(RESOURCE).forEach(key => { if (RESOURCE[key].path.length > pathSize) { pathSize = RESOURCE[key].path.length } })
  if (HAS_RESOURCES) app.logger.appPrimary()
  Object.keys(RESOURCE).forEach(key => {
    const ROUTE     = RESOURCE[key]
    let permissions = []
    if (MIDDLEWARE[key]) { MIDDLEWARE[key].forEach(mw => { if (mw.permissions) { permissions = mw.permissions } }) }
    ROUTE.outputFilter = typeof ROUTE.outputFilter !== 'undefined' ? ROUTE.outputFilter : true
    ROUTE.inputLogs    = typeof ROUTE.inputLogs    !== 'undefined' ? ROUTE.inputLogs    : true
    ROUTE.key          = key
    ROUTE.resourceName = RESOURCE_MAME
    ROUTE.moduleName   = MODULE_NAME
    ROUTE.name         = `${_toWords(_.upperFirst(_.camelCase(`${key}_${RESOURCE_MAME}`)))}`
    ROUTE.group        = `${MODULE_NAME} ${_toWords(_.upperFirst(_.camelCase(`${RESOURCE_MAME}`)))}`
    ROUTE.permissions  = permissions
    ROUTE.input        = INPUT[key]      || {}
    ROUTE.output       = OUTPUT[key]     || {}
    ROUTE.middleware   = MIDDLEWARE[key] || []
    ROUTE.controller   = CONTROLLER[key]
    validateFieldGroup(app, 'input',  ROUTE.input,  key)
    validateFieldGroup(app, 'output', ROUTE.output, key)
    validateInputParams(app, ROUTE.path, ROUTE.input, key)
    const routeMethod = _.padEnd(`${ROUTE.method.toUpperCase()}`, 6, ' ')
    const routePath   = _.padEnd(`${ROUTE.path} `, pathSize + 1, '.')
    const routeKey    = ROUTE.key
    if (!ROUTE.controller) {
      const data = `  Se requiere un controlador.\n`
      app.logger.appError('[ruta]', `${routeMethod} ${routePath}... ${routeKey} ${app.logger.FAIL}`, data)
    }
    app.apidoc.router[ROUTE.method.toLowerCase()](ROUTE.path, ROUTE)
    app.logger.appPrimary('[ruta]', `${routeMethod} ${routePath}... ${routeKey} ${app.logger.OK}`)
  })
  app.logger.appPrimary()
  return RESOURCE
}

/**
* @ignore
* Valida el contenido de los ficheros input y output de una ruta.
* @param {!Function} app  - Instancia del servidor express.
* @param {!String}   type - Tipo de componente al que pertenece el objeto.
* @param {!Object}   data - Objeto input u output.
* @param {!String}   key  - Clave asociada a una ruta.
*/
function validateFieldGroup (app, type, data, key) {
  try {
    FieldCreator.validateGroup(data)
  } catch (e) {
    app.logger.appError(null, `Ocurrió un error mientras se cargaba el componente '${type}' de la ruta '${key}'. ${e.message}\n`)
    throw e
  }
}

function validateInputParams (app, path, input, key) {
  if (input.params) {
    const params = Object.keys(input.params)
    for (let i in params) {
      if (!path.includes(`:${params[i]}`)) {
        const msg = `El parámetro 'INPUT.params.${params[i]}' no se encuentra definido en la propiedad 'path' de la ruta`
        app.logger.appError(null, `Ocurrió un error mientras se cargaba el componente 'input' de la ruta '${key}'. ${msg}\n`)
        throw new Error(msg)
      }
    }
  }
}

/**
* @ignore
* Separa el conenido de una frase en palabras.
* @param {String} text - frase
* @return {String}
*/
function _toWords (text) {
  return _.replace((_.words(text)).toString(), /,/g, ' ')
}

module.exports = Module
