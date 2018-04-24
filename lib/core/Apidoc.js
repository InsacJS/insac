/** @ignore */ const ApidocCreator = require('apidoc-creator').Apidoc

/** @ignore */ const path      = require('path')
/** @ignore */ const Validator = require('input-data-validator').Validator
/** @ignore */ const Response  = require('response-handler').Response
/** @ignore */ const Options   = require('sequelize-options').Options

/** @ignore */ const Field       = require('../core/Field')
/** @ignore */ const util        = require('../tools/util')
/** @ignore */ const stdout      = require('../tools/stdout')
/** @ignore */ const insacConfig = require('../config/insac.config')

/**
* Módulo encargado de automatizar la creación del apidoc.
*/
class Apidoc {
  /**
  * Crea una instancia de la clase Apidoc.
  * @param {Function} app - Instancia del servidor express.
  */
  constructor (app) {
    /**
    * Instancia del servidor express.
    * @type {Function}
    */
    this.app = app

    /**
    * Contiene el apidoc en texto plano.
    * @type {String}
    */
    this.apidocContent = ''

    /**
    * Enrutador del apidoc.
    * @type {Object}
    */
    this.router = ApidocCreator.router((route, apidoc) => {
      app[route.method](
        route.path,
        this._successMiddleware(route),
        this._validatorMiddleware(route),
        this._optionsMiddleware(route),
        route.middleware || [],
        route.controller
      )
      this.apidocContent += `\n${apidoc}\n`
    })
  }

  /**
  * Devuelve un middleware para validar los datos de entrada de un ruta.
  * @param {Object}   route - Propiedades de la ruta.
  * @return {Function}
  */
  _validatorMiddleware (route) {
    return Validator.validate(route.input)
  }

  /**
  * Adiciona las funciones de tipo success en el response, para enviar respuestas exitosas.
  * @param {Object}   route - Propiedades de la ruta.
  * @return {Function}
  */
  _successMiddleware (route) {
    const responseData = (process.env.RESPONSE_LOG && (process.env.RESPONSE_LOG === 'true')) ? (...args) => stdout.responseData(...args) : () => {}
    const responseCode = (process.env.REQUEST_LOG  && (process.env.REQUEST_LOG === 'true'))  ? (...args) => stdout.responseCode(...args) : () => {}
    function onSuccess (data, req) {
      data.data = Options.filter(data.data, {
        query       : req.query,
        output      : route.output,
        plainOutput : route.plainOutput
      })
      responseData(req, data.data)
      responseCode(req, data)
      return data
    }
    return Response.success({ successFormat: insacConfig.RESPONSE.successFormat, onSuccess })
  }

  /**
  * Adiciona la variable options en el request para realizar consultas sequelize.
  * @param {Object}   route - Propiedades de la ruta.
  * @return {Function}
  */
  _optionsMiddleware (route) {
    const MODULE   = route.moduleName
    const RESOURCE = route.resourceName
    const MODEL    = (MODULE && RESOURCE && this.app[MODULE].models) ? this.app[MODULE].models[RESOURCE] : undefined
    const IS_LIST  = Array.isArray(route.output)
    function createOptions (req) {
      if (IS_LIST) {
        req.query.order  = req.query.order
        req.query.limit  = req.query.limit || (Field.LIMIT ? Field.LIMIT.defaultValue : 50)
        req.query.page   = req.query.page  || (Field.PAGE  ? Field.PAGE.defaultValue  : 1)
        req.query.offset = (req.query.page >= 1) ? ((req.query.page - 1) * req.query.limit) : 0
        if (MODEL) {
          req.query.distinct = true
          req.query.col      = MODEL.primaryKeyAttributes[0]
        }
      }
      return Options.create({ query: req.query, output: route.output, model: MODEL, keys: true })
    }
    return (req, res, next) => {
      req.options = createOptions(req)
      next()
    }
  }

  /**
  * Construye el apidoc.
  * @return {Promise}
  */
  async build () {
    const tmpPath = path.resolve(__dirname, '../../tmp')
    const outPath = path.resolve(process.cwd(), 'public')
    util.mkdir(tmpPath)
    util.mkdir(outPath)
    if (insacConfig.APIDOC.header) {
      let HEADER_PATH     = path.resolve(process.cwd(), `apidoc/${insacConfig.APIDOC.header.filename}`)
      let HEADER_PATH_TMP = path.resolve(tmpPath, insacConfig.APIDOC.header.filename)
      if (!util.isFile(HEADER_PATH)) { HEADER_PATH = path.resolve(__dirname, `./../apidoc/HEADER.md`) }
      util.copyFile(HEADER_PATH, HEADER_PATH_TMP)
    }
    if (insacConfig.APIDOC.footer) {
      let FOOTER_PATH     = path.resolve(process.cwd(), `apidoc/${insacConfig.APIDOC.footer.filename}`)
      let FOOTER_PATH_TMP = path.resolve(tmpPath, insacConfig.APIDOC.footer.filename)
      if (!util.isFile(FOOTER_PATH)) { FOOTER_PATH = path.resolve(__dirname, `./../apidoc/FOOTER.md`) }
      util.copyFile(FOOTER_PATH, FOOTER_PATH_TMP)
    }
    util.writeFile(path.resolve(tmpPath, 'apidoc.json'), JSON.stringify(insacConfig.APIDOC, null, 2))
    util.writeFile(path.resolve(tmpPath, 'apidoc.js'), this.apidocContent)
    const input  = path.resolve(tmpPath, 'apidoc.js')
    const output = path.resolve(outPath, 'apidoc')
    await util.cmd(`apidoc -f "${input}" -o "${output}"`, tmpPath)
    this._updateIndex(output)
    try { util.rmdir(tmpPath) } catch (e) { }
  }

  /**
  * Elimina el directorio que contiene la documentación de los servicios (apidoc).
  */
  remove () {
    try { util.rmdir(path.resolve(process.cwd(), 'public/apidoc')) } catch (e) { }
  }

  /**
  * Actualiza la propiedad href del archivo index.html.
  * @param {!String} output - Ruta del directorio que contiene al archivo index.
  * @return {String}
  */
  _updateIndex (output) {
    const INDEX_PATH = path.resolve(output, 'index.html')
    const URL        = insacConfig.APIDOC.url
    if (!util.isFile(INDEX_PATH)) {
      return console.log(` No se encontraron rutas para generar el APIDOC.\n`)
    }
    let indexContent   = util.readFile(INDEX_PATH)
    const BASE_HREF    = indexContent.indexOf(`<base href="./">`) !== -1
    const REPLACE      = BASE_HREF ? `<base href="./">`             : `<head>`
    const REPLACE_WITH = BASE_HREF ? `<base href="${URL}/apidoc/">` : `<head>\n  <base href="${URL}/apidoc/">`
    indexContent = indexContent.replace(REPLACE, REPLACE_WITH)
    util.writeFile(INDEX_PATH, indexContent)
  }
}

module.exports = Apidoc
