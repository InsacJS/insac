const express = require('express')
const util    = require('./tools/util')
const Task    = require('./tools/Task')
const path    = require('path')
const _       = require('lodash')
const https   = require('https')

const CONFIG_PATH       = path.resolve(process.cwd(), 'src/config/index.js')

const BEFORE_START_PATH = path.resolve(process.cwd(), 'src/boot/before_start.js')
const BEFORE_SETUP_PATH = path.resolve(process.cwd(), 'src/boot/before_setup.js')
const AFTER_START_PATH  = path.resolve(process.cwd(), 'src/boot/after_start.js')
const AFTER_SETUP_PATH  = path.resolve(process.cwd(), 'src/boot/after_setup.js')

/*!
* Insac Framework
* Copyright(c) 2018 Alex Quispe
* MIT License
*/
class Insac {
  constructor () {
    this.app               = express()
    this.app.log = (!process.env.LOG || process.env.LOG === 'true') ? str => process.stdout.write(str) : () => {}
    this.app.log(`\x1b[32m\n |===============================================|\n`)
    this.app.log(` |======  \x1b[33m I N S A C   F R A M E W O R K \x1b[32m  ======|\n`)
    this.app.log(` |===============================================|\n\x1b[0m\n`)
    this.app.config        = util.isFile(CONFIG_PATH) ? require(CONFIG_PATH) : {}
    this.app.config.SERVER = _.merge({
      port : process.env.PORT     || 4000,
      env  : process.env.NODE_ENV || 'development',
      cors : {
        'origin'            : '*',
        'methods'           : 'GET,POST,PUT,DELETE,OPTIONS',
        'preflightContinue' : true,
        'allowedHeaders'    : 'Authorization,Content-Type,Content-Length'
      },
      https: false
    }, this.app.config.SERVER || {})
    this.app.MODULES = []

    // |=============================================================|
    // |------------ CONFIGURACIÓN INICIAL --------------------------|
    // |=============================================================|

    require('./tools/Field.js')
    require('./config/database')(this.app)
    require('./config/apidoc')(this.app)
    require('./config/response')(this.app)
    require('./config/middleware')(this.app)
  }

  addModule (moduleName) {
    util.find('src/modules', '.module.js', ({ filePath, fileName, dirPath }) => {
      const MODULE_NAME = fileName.toUpperCase()
      if (MODULE_NAME === moduleName) {
        const CONFIG = this.app.config[MODULE_NAME] || {}
        CONFIG.moduleName = MODULE_NAME
        CONFIG.modulePath = dirPath
        this.app[MODULE_NAME] = require(filePath)(this.app, CONFIG)
        this.app.MODULES.push(MODULE_NAME)
      }
    })
  }

  async init () {
    try {
      if (process.env.SETUP && process.env.SETUP === 'true') {
        if (util.isFile(BEFORE_SETUP_PATH)) { await require(BEFORE_SETUP_PATH)(this.app) }
        await _setup(this.app)
        if (util.isFile(AFTER_SETUP_PATH))  { await require(AFTER_SETUP_PATH)(this.app) }
        process.exit(0)
      }

      if (util.isFile(BEFORE_START_PATH)) { await require(BEFORE_START_PATH)(this.app) }
      await _start(this.app)
      if (util.isFile(AFTER_START_PATH))  { await require(AFTER_START_PATH)(this.app) }

      if (!process.env.LISTEN || (process.env.LISTEN === 'true')) {
        await _listen(this.app)
      }
    } catch (err) { console.log(err); process.exit(0) }
  }
}

async function _setup (app) {
  app.log('\x1b[2m |===============================================|\n')
  app.log(' |--------- \x1b[0m  INSTALANDO   APLICACIÓN \x1b[2m  ---------|\n')
  app.log(' |===============================================|\x1b[0m\n\n')
  const modules = process.env.MODULE ? process.env.MODULE.split(',') : []
  for (let i in app.MODULES) {
    const MODULE_NAME = app.MODULES[i]
    if ((modules.length === 0) || modules.includes(MODULE_NAME)) {
      app.log(` Módulo ${MODULE_NAME} ... \n\n`)
      await app[MODULE_NAME].onSetup(app)
      app.log('\n' + ` ${MODULE_NAME} \u2713 \n\n`)
    }
  }
  app.log(` - Instalación finalizada correctamente.\n\n`)
}

async function _start (app) {
  app.log('\x1b[2m |===============================================|\n')
  app.log(' |------- \x1b[0m  INICIALIZANDO   APLICACIÓN \x1b[2m  --------|\n')
  app.log(' |===============================================|\x1b[0m\n\n')
  for (let i in app.MODULES) {
    const MODULE_NAME = app.MODULES[i]
    app.log(` Módulo ${MODULE_NAME} ... \n\n`)
    await app[MODULE_NAME].onStart(app)
    app.log(`\n ${MODULE_NAME} \u2713 \n\n`)
  }
  if (process.env.APIDOC && process.env.APIDOC === 'true') {
    const task1 = new Task(` Create APIDOC`)
    task1.start()
    await app.APIDOC.build()
    task1.finish('\n')
  }
}

async function _listen (app) {
  const PROTOCOLO = (app.config.SERVER.https === true) ? 'https' : 'http'
  if (app.config.SERVER.https === true) {
    const options = app.config.SERVER.ssl
    https.createServer(options, app).listen(app.config.SERVER.port)
  } else {
    app.listen(app.config.SERVER.port)
  }
  app.log(` Servicio activo en modo ${app.config.SERVER.env}\n\n`)
  const URL = `${PROTOCOLO}://localhost:${app.config.SERVER.port}`
  app.log(` - [service] ${URL}\n`)
  if (process.env.APIDOC && process.env.APIDOC === 'true') {
    app.log(` - [apidoc]  ${URL}/apidoc\n\n`)
  }
}

module.exports = Insac
