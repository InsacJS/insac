const Validator = require('input-data-validator').Validator
const Response  = require('response-handler').Response
const Options   = require('sequelize-options').Options
const Apidoc    = require('apidoc-creator').Apidoc
const Field     = require('field-creator').Field
const path      = require('path')
const util      = require('../tools/util')

module.exports = (app) => {
  const INFO_PATH = path.resolve(process.cwd(), 'INFO.md')
  const PROTOCOL  = (app.config.SERVER.https === true) ? 'https' : 'http'
  const DOMAIN    = 'localhost'
  const CONFIG = {
    url      : `${PROTOCOL}://${DOMAIN}:${app.config.SERVER.port}`,
    template : {
      withGenerator : false,
      withCompare   : false,
      forceLanguage : 'es'
    }
  }
  if (util.isFile(INFO_PATH)) {
    CONFIG.header = { title: 'INFO', filename: 'INFO.md' }
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
  })

  APIDOC.build = async function build () {
    const tmpPath = path.resolve(__dirname, '../../tmp')
    const outPath = path.resolve(process.cwd(), 'public')
    util.mkdir(tmpPath)
    util.mkdir(outPath)
    if (util.isFile(INFO_PATH)) { util.copyFile(INFO_PATH, path.resolve(tmpPath, 'INFO.md')) }
    util.writeFile(path.resolve(tmpPath, 'apidoc.json'), JSON.stringify(CONFIG, null, 2))
    util.writeFile(path.resolve(tmpPath, 'apidoc.js'), apidocContent)
    const input  = path.resolve(tmpPath, 'apidoc.js')
    const output = path.resolve(outPath, 'apidoc')
    await util.cmd(`apidoc -f "${input}" -o "${output}"`, tmpPath)
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
  QUERY.order  = QUERY.order
  QUERY.limit  = QUERY.limit || (Field.LIMIT ? Field.LIMIT.defaultValue : 50)
  const PAGE   = QUERY.page  || (Field.PAGE  ? Field.PAGE.defaultValue  : 1)
  QUERY.offset = (PAGE >= 1) ? ((PAGE - 1) * QUERY.limit) : 0
  if (MODEL) {
    QUERY.distinct = true
    QUERY.col = MODEL.primaryKeyAttributes[0]
  }
}
