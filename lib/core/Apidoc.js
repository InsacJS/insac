// const _ = require('lodash')
const { FieldContainer } = require('insac-field')
const { Apidoc } = require('insac-apidoc')
const { exec } = require('child_process')
const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs')
const _ = require('lodash')

module.exports = (app) => {
  /**
  * |=============================================================|
  * |------------ FIELDS PARA VALIDAR Y DOCUMENTAR ---------------|
  * |=============================================================|
  */
  app.FIELD = new FieldContainer(app.DB.sequelize)

  /**
  * |=============================================================|
  * |------------ APIDOC -----------------------------------------|
  * |=============================================================|
  */

  const CONFIG = {
    url: `http://localhost:${process.env.PORT}`,
    template: {
      withGenerator: false,
      withCompare: false,
      forceLanguage: 'es'
    },
    header: {
      title: 'INFO',
      filename: 'info.md'
    }
  }

  let apidocContent = ''
  app.APIDOC = Apidoc.router((route, apidoc) => {
    app[route.method](route.path, route.controller)
    apidocContent += `\n${apidoc}\n`
    console.log(`${_.padEnd(` [${route.method}]`, 10, ' ')} ${_.padEnd(route.path, 26, ' ')}     ${route.key}`)
  })
  app.APIDOC.build = async function build () {
    try {
      const docPath = path.resolve(__dirname, './../../apidoc')
      const tmpPath = path.resolve(__dirname, './../../tmp')
      const outPath = path.resolve(path.dirname(require.main.filename), 'public')
      mkdirp.sync(tmpPath)
      mkdirp.sync(outPath)
      fs.writeFileSync(path.resolve(tmpPath, 'apidoc.json'), JSON.stringify(CONFIG, null, 2))
      fs.writeFileSync(path.resolve(tmpPath, 'apidoc.js'), apidocContent)
      fs.createReadStream(path.resolve(docPath, 'info.md')).pipe(fs.createWriteStream(path.resolve(tmpPath, 'info.md')))
      const input = path.resolve(tmpPath, 'apidoc.js')
      const output = path.resolve(outPath, 'apidoc')
      await execApidoc(input, output, tmpPath)
      updateIndex(output, CONFIG.url)
      // UTIL.dir.delete('tmp')
    } catch (error) {
      console.log(' Hubo un error al crear la documentación.')
      throw error
    }
  }

  function execApidoc (input, output, tmpPath) {
    return new Promise((resolve, reject) => {
      exec(`apidoc -f "${input}" -o "${output}"`, {cwd: tmpPath}, (error, stdout, stderr) => {
        if (error !== null) { reject(stderr) } else { resolve(stdout) }
      })
    })
  }

  function updateIndex (output, url) {
    const INDEX_PATH = path.resolve(output, 'index.html')
    if (!fs.existsSync(INDEX_PATH)) {
      return console.log(` No se encontraron rutas para generar el APIDOC.\n`)
    }
    let indexHTMLContent = fs.readFileSync(INDEX_PATH, 'utf-8')
    if (indexHTMLContent.indexOf(`<base href="./">`) !== -1) {
      indexHTMLContent = indexHTMLContent.replace(`<base href="./">`, `<base href="${url}/apidoc/">`)
    } else {
      indexHTMLContent = indexHTMLContent.replace(`<head>`, `<head>\n  <base href="${url}/apidoc/">`)
    }
    fs.writeFileSync(INDEX_PATH, indexHTMLContent)
  }
}
