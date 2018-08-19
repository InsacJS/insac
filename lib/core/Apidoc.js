/** @ignore */ const path = require('path')

/** @ignore */ const ApidocCreator      = require('../libs/ApidocCreator')
/** @ignore */ const InputDataValidator = require('../libs/InputDataValidator')
/** @ignore */ const ResponseHandler    = require('../libs/ResponseHandler')
/** @ignore */ const SequelizeOptions   = require('../libs/SequelizeOptions')

/** @ignore */ const Field  = require('../libs/FieldCreator')

/** @ignore */ const util   = require('../tools/util')

/**
* Módulo encargado de automatizar la creación del apidoc.
*/
class Apidoc {
  /**
  * Crea una instancia de la clase Apidoc.
  */
  constructor () {
    /**
    * Contiene el apidoc en texto plano, por módulos.
    * @type {Object}
    */
    this.apidocContent = {}

    /**
    * Enrutador del apidoc.
    * @type {Object}
    */
    this.router = null
  }

  /**
  * Inicializa las propiedades de la instancia.
  * @param {Function} app - Instancia del servidor express.
  */
  onInit (app) {
    this.apidocContent = {}
    this.router        = ApidocCreator.router((route) => {
      const MODULE = route.moduleName
      app[route.method](
        route.path,
        this._inputLogsMiddleware(app, route),
        this._successMiddleware(app, route),
        this._validatorMiddleware(route),
        this._optionsMiddleware(app, route),
        route.middleware || [],
        route.controller
      )
      if (!this.apidocContent[MODULE]) { this.apidocContent[MODULE] = '' }
      this.apidocContent[MODULE] += `\n${route.apidoc}\n`
    })
  }

  /**
  * Indica si el apidoc está habilitado.
  * @return {Boolean}
  */
  isEnabled () {
    return !process.env.APIDOC || process.env.APIDOC === 'true'
  }

  /**
  * Elimina el directorio que contiene la documentación de los servicios (apidoc).
  * @param {Function} app - Instancia del servidor express.
  */
  remove (app) {
    const APIDOC_PATH = app.config.PATH.apidoc
    try {
      if (util.isDir(APIDOC_PATH)) { util.rmdir(APIDOC_PATH) }
    } catch (e) {
      app.logger.appWarn(`No se pudo eliminar la carpeta '${APIDOC_PATH.replace(app.config.PATH.project, '')}'.`, e.message)
    }
  }

  /**
  * Construye el apidoc.
  * @param {Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async build (app) {
    const templatePath = path.resolve(__dirname, '../apidoc/template')
    const tmpPath      = path.resolve(__dirname, '../../.temp')
    util.mkdir(tmpPath)
    if (app.config.APIDOC.header) {
      let HEADER_PATH     = path.resolve(app.config.PATH.project, `./${app.config.APIDOC.header.filename}`)
      let HEADER_PATH_TMP = path.resolve(tmpPath, app.config.APIDOC.header.filename)
      if (!util.isFile(HEADER_PATH)) { HEADER_PATH = path.resolve(__dirname, `./../apidoc/HEADER.md`) }
      util.copyFile(HEADER_PATH, HEADER_PATH_TMP)
    }
    if (app.config.APIDOC.footer) {
      let FOOTER_PATH     = path.resolve(app.config.PATH.project, `./${app.config.APIDOC.footer.filename}`)
      let FOOTER_PATH_TMP = path.resolve(tmpPath, app.config.APIDOC.footer.filename)
      if (!util.isFile(FOOTER_PATH)) { FOOTER_PATH = path.resolve(__dirname, `./../apidoc/FOOTER.md`) }
      util.copyFile(FOOTER_PATH, FOOTER_PATH_TMP)
    }
    util.writeFile(path.resolve(tmpPath, 'apidoc.json'), JSON.stringify(app.config.APIDOC, null, 2))
    app.modules.forEach(mod => {
      if (app[mod].hasComponent('resources', '.route.js')) {
        util.writeFile(path.resolve(tmpPath, `doc/${mod}/apidoc.js`), this.apidocContent[mod] || '')
      }
    })
    const output = app.config.PATH.apidoc
    try { util.rmdir(output) } catch (e) { }
    if (this.isEnabled()) {
      const resourceModules = app.getResourceModules()
      for (let i in resourceModules) {
        const mod = resourceModules[i]
        try {
          await this._createApidoc(`doc/${mod}`, `${output}/${mod}`, templatePath, tmpPath)
          await this._updateIndex(app, output, mod)
          app.logger.appVerbose('[apidoc]', `Módulo ${mod} ... ${app.logger.OK}`)
        } catch (e) {
          app.logger.appError('[apidoc]', `Módulo ${mod} ... ${app.logger.FAIL}\n`)
          throw e
        }
      }
    }
    app.logger.appVerbose()
    try { util.rmdir(tmpPath) } catch (e) { }
  }

  /**
  * Devuelve un middleware que muestra logs de los datos de entrada.
  * @param {Function} app   - Instancia del servidor express.
  * @param {Object}   route - Propiedades de la ruta.
  * @return {Function}
  */
  _inputLogsMiddleware (app, route) {
    if (route.inputLogs) {
      return (req, res, next) => {
        app.logger.inputHeaders(req)
        app.logger.inputParams(req)
        app.logger.inputQuery(req)
        app.logger.inputBody(req)
        return next()
      }
    }
    return []
  }

  /**
  * Devuelve un middleware para validar los datos de entrada de un ruta.
  * @param {Object}   route - Propiedades de la ruta.
  * @return {Function}
  */
  _validatorMiddleware (route) {
    return InputDataValidator.validate(route.input)
  }

  /**
  * Adiciona las funciones de tipo success en el response, para enviar respuestas exitosas.
  * @param {Function} app   - Instancia del servidor.
  * @param {Object}   route - Propiedades de la ruta.
  * @return {Function}
  */
  _successMiddleware (app, route) {
    function onSuccess (result, req) {
      if (route.outputFilter) {
        result.data = SequelizeOptions.filter(result.data, {
          query  : req.query,
          output : route.output,
          plain  : route.plain
        })
      }
      req.endAt = Date.now()
      app.logger.outputData(req, result)
      app.logger.responseSuccess(req, result)
    }
    return ResponseHandler.success({ successFormat: app.config.RESPONSE.successFormat, onSuccess, all200: app.config.RESPONSE.all200 })
  }

  /**
  * Adiciona la variable options en el request para realizar consultas sequelize.
  * @param {Function} app   - Instancia del servidor.
  * @param {Object}   route - Propiedades de la ruta.
  * @return {Function}
  */
  _optionsMiddleware (app, route) {
    const MODULE   = route.moduleName
    const RESOURCE = route.resourceName
    const MODEL    = (MODULE && RESOURCE && app[MODULE].models) ? app[MODULE].models[RESOURCE] : undefined
    const IS_LIST  = Array.isArray(route.output)
    function createOptions (req) {
      if (IS_LIST) {
        req.query.limit  = req.query.limit || (Field.LIMIT() ? Field.LIMIT().defaultValue : 50)
        req.query.page   = req.query.page  || (Field.PAGE()  ? Field.PAGE().defaultValue  : 1)
        req.query.offset = (req.query.page >= 1) ? ((req.query.page - 1) * req.query.limit) : 0
        if (MODEL) {
          req.query.distinct = true
          req.query.col      = MODEL.primaryKeyAttributes[0]
        }
      }
      return SequelizeOptions.create({ query: req.query, output: route.output, model: MODEL, keys: true })
    }
    return (req, res, next) => {
      req.options = createOptions(req)
      next()
    }
  }

  /**
  * Ejecuta el comando para crear el APIDOC.
  * @param {String} input    - Ruta del directorio de entrada.
  * @param {String} output   - Ruta del directorio de salida.
  * @param {String} template - Ruta del directorio del template.
  * @param {String} execPath - Ruta desde donde se ejecutará el comando.
  * @return {Promise}
  */
  async _createApidoc (input, output, template, execPath) {
    try {
      await util.cmd(`node "../../apidoc/bin/apidoc" -i "${input}" -o "${output}" -t "${template}"`, execPath)
    } catch (e) {
      try {
        await util.cmd(`node "../node_modules/apidoc/bin/apidoc" -i "${input}" -o "${output}" -t "${template}"`, execPath)
      } catch (e) {
        try {
          await util.cmd(`apidoc -i "${input}" -o "${output}" -t "${template}"`, execPath)
        } catch (e) {
          if (typeof e === 'string' && (e.includes('apidoc: not found') || e.includes('no se reconoce como un comando'))) {
            throw new Error(`ApidocJS no se encuentra instalado: Ejecute 'npm install -g apidoc' para solucionarlo.`)
          }
          throw e
        }
      }
    }
  }

  /**
  * Actualiza la propiedad href del archivo index.html.
  * @param {Function} app    - Instancia del servidor de express.
  * @param {!String}  output - Ruta del directorio que contiene al archivo index.html
  * @param {String}   mod    - Nombre del módulo al que pertenece el apidoc.
  */
  _updateIndex (app, output, mod) {
    const INDEX_PATH = path.resolve(output, `${mod}/index.html`)
    const URL        = app.config.APIDOC.url
    if (!util.isFile(INDEX_PATH)) {
      let emptyContent = util.readFile(path.resolve(__dirname, '../apidoc/empty/index.html'))
      emptyContent = emptyContent.replace('{{INDEX_PAGE_URL}}', `${app.config.APIDOC.url}`)
      return util.writeFile(INDEX_PATH, emptyContent)
    }
    let indexContent   = util.readFile(INDEX_PATH)
    const BASE_HREF    = indexContent.indexOf(`<base href="./">`) !== -1
    const REPLACE      = BASE_HREF ? `<base href="./">`             : `<head>`
    const REPLACE_WITH = BASE_HREF ? `<base href="${URL}/apidoc/${mod}/">` : `<head>\n  <base href="${URL}/apidoc/${mod}/">`
    indexContent = indexContent.replace(REPLACE, REPLACE_WITH)
    util.writeFile(INDEX_PATH, indexContent)
  }
}

module.exports = Apidoc
