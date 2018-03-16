const Validator = require('input-data-validator').Validator
const Response  = require('response-handler').Response
const Options   = require('sequelize-options').Options
const Apidoc    = require('apidoc-creator').Apidoc
const Field     = require('field-creator').Field
const path      = require('path')
const _         = require('lodash')
const util      = require('../tools/util')

module.exports = (app) => {
  /**
  * |=============================================================|
  * |------------ APIDOC -----------------------------------------|
  * |=============================================================|
  */
  const protocolo = (app.config.SERVER.secure === true) ? 'https' : 'http'
  const CONFIG = {
    url      : `${protocolo}://localhost:${app.config.SERVER.port}`,
    template : {
      withGenerator : false,
      withCompare   : false,
      forceLanguage : 'es'
    },
    header: {
      title    : 'INFO',
      filename : 'info.md'
    }
  }
  let apidocContent = ''

  const APIDOC = app.APIDOC = Apidoc.router((route, apidoc) => {
    function onSuccess (data, req) {
      data.data = Options.filter(data.data, {
        query       : req.query,
        output      : route.output,
        plainOutput : route.plainOutput
      })
      return data
    }
    const MODEL  = (route.moduleName && route.resourceName && app[route.moduleName].models)
      ? app[route.moduleName].models[route.resourceName] : undefined
    const isList = Array.isArray(route.output)
    function createOptions (req) {
      if (isList) { _updateQueryForList(req.query, MODEL) }
      return Options.create({ query: req.query, output: route.output, model: MODEL, keys: true })
    }
    const OPTIONS_MIDDLEWARE = (req, res, next) => {
      req.options = createOptions(req)
      next()
    }
    app[route.method](
      route.path,
      Response.success({ successFormat: Response.successFormat, onSuccess }),
      Validator.validate(route.input),
      OPTIONS_MIDDLEWARE,
      route.middleware || [],
      route.controller
    )
    apidocContent += `\n${apidoc}\n`
    console.log(`\x1b[2m${_.padEnd(` [${route.method}]`, 10, ' ')} ${_.padEnd(route.path, 26, ' ')}     ${route.key}\x1b[0m`)
  })

  APIDOC.build = async function build () {
    const docPath = path.resolve(__dirname, '../apidoc')
    const tmpPath = path.resolve(__dirname, '../../tmp')
    const outPath = path.resolve(process.cwd(), 'public')
    util.mkdir(tmpPath)
    util.mkdir(outPath)
    util.writeFile(path.resolve(tmpPath, 'apidoc.json'), JSON.stringify(CONFIG, null, 2))
    util.writeFile(path.resolve(tmpPath, 'apidoc.js'), apidocContent)
    util.copyFile(path.resolve(docPath, 'info.md'), path.resolve(tmpPath, 'info.md'))
    const input  = path.resolve(tmpPath, 'apidoc.js')
    const output = path.resolve(outPath, 'apidoc')
    await util.executeCommand(`apidoc -f "${input}" -o "${output}"`, tmpPath)
    _updateIndex(output, CONFIG.url)
    util.rmdir(tmpPath)
  }
}

function _updateIndex (output, url) {
  const INDEX_PATH = path.resolve(output, 'index.html')
  if (!util.isFile(INDEX_PATH)) {
    return console.log(` No se encontraron rutas para generar el APIDOC.\n`)
  }
  let indexHTMLContent = util.readFile(INDEX_PATH)
  if (indexHTMLContent.indexOf(`<base href="./">`) !== -1) {
    indexHTMLContent = indexHTMLContent.replace(`<base href="./">`, `<base href="${url}/apidoc/">`)
  } else {
    indexHTMLContent = indexHTMLContent.replace(`<head>`, `<head>\n  <base href="${url}/apidoc/">`)
  }
  util.writeFile(INDEX_PATH, indexHTMLContent)
}

function _updateQueryForList (QUERY, MODEL) {
  QUERY.order = QUERY.order || Field.ORDER.defaultValue
  QUERY.limit = QUERY.limit || Field.LIMIT.defaultValue
  const PAGE = QUERY.page  || Field.PAGE.defaultValue
  QUERY.offset = (PAGE >= 1) ? ((PAGE - 1) * QUERY.limit) : 0
  if (MODEL) {
    QUERY.distinct = true
    QUERY.col = MODEL.primaryKeyAttributes[0]
  }
}
