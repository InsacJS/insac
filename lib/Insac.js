const express = require('express')
const util    = require('./tools/util')
const Task    = require('./tools/Task')
const path    = require('path')
const _       = require('lodash')
const https   = require('https')

const CONFIG_PATH = path.resolve(process.cwd(), 'src/config/index.js')
const config      = util.isFile(CONFIG_PATH) ? require(CONFIG_PATH) : {}

const SERVER = _.merge({
  port : process.env.PORT     || 4000,
  env  : process.env.NODE_ENV || 'development',
  cors : {
    'origin'            : '*',
    'methods'           : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue' : true,
    'allowedHeaders'    : 'Authorization,Content-Type,Content-Length'
  },
  secure: false
}, config.SERVER || {})

/*!
* Insac Framework
* Copyright(c) 2018 Alex Quispe
* MIT License
*/
class Insac {
  constructor () {
    process.stdout.write(`\x1b[32m\n |===============================================|\n`)
    process.stdout.write(` |======  \x1b[33m I N S A C   F R A M E W O R K \x1b[32m  ======|\n`)
    process.stdout.write(` |===============================================|\n\x1b[0m\n`)

    this.app = express()
    this.app.config = config

    /**
    * |=============================================================|
    * |------------ CONFIGURACIÓN INICIAL --------------------------|
    * |=============================================================|
    */
    require('./boot/database')(this.app)
    require('./boot/apidoc')(this.app)
    require('./boot/field')(this.app)
    require('./boot/response')(this.app)
    require('./boot/middlewares')(this.app)

    /**
    * |=============================================================|
    * |------------ MODULOS ----------------------------------------|
    * |=============================================================|
    */
    this.app.MODULES = []
  }

  addModule (moduleName) {
    util.find('src/modules', '.module.js', ({ filePath, fileName, dirPath }) => {
      const MODULE_NAME = fileName.toUpperCase()
      if (MODULE_NAME === moduleName) {
        const CONFIG = config[MODULE_NAME] || {}
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
        await _setup(this.app)
        process.exit(0)
      }
      this.app.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
          return res.status(200).send('ok')
        }
        console.log(`[${req.method}] ${req.originalUrl}`)
        return next()
      })
      await _start(this.app)

      /**
      * |=============================================================|
      * |------------ MIDDLEWARE PARA CAPTURAR ERRORES ---------------|
      * |=============================================================|
      */
      this.app.use((req, res, next) => {
        res.status(404).send('Not Found')
      })
      this.app.use((err, req, res, next) => {
        res.error(err)
      })
    } catch (err) { console.log(err) }
  }
}

async function _setup (app) {
  process.stdout.write('\x1b[2m |===============================================|\n')
  process.stdout.write(' |--------- \x1b[0m  INSTALANDO   APLICACIÓN \x1b[2m  ---------|\n')
  process.stdout.write(' |===============================================|\x1b[0m\n\n')
  const modules = process.env.MODULE ? process.env.MODULE.split(',') : []
  for (let i in app.MODULES) {
    const MODULE_NAME = app.MODULES[i]
    if ((modules.length === 0) || modules.includes(MODULE_NAME)) {
      process.stdout.write(` Módulo ${MODULE_NAME} ... \n\n`)
      await app[MODULE_NAME].onSetup(app)
      process.stdout.write('\n' + ` ${MODULE_NAME} \u2713 \n\n`)
    }
  }
  process.stdout.write(` - Instalación finalizada correctamente.\n\n`)
}

async function _start (app) {
  process.stdout.write('\x1b[2m |===============================================|\n')
  process.stdout.write(' |------- \x1b[0m  INICIALIZANDO   APLICACIÓN \x1b[2m  --------|\n')
  process.stdout.write(' |===============================================|\x1b[0m\n\n')
  for (let i in app.MODULES) {
    const MODULE_NAME = app.MODULES[i]
    process.stdout.write(` Módulo ${MODULE_NAME} ... \n\n`)
    await app[MODULE_NAME].onStart(app)
    process.stdout.write(`\n ${MODULE_NAME} \u2713 \n\n`)
  }
  if (process.env.APIDOC && process.env.APIDOC === 'true') {
    const task1 = new Task(` Create APIDOC`)
    task1.start()
    await app.APIDOC.build()
    task1.finish('\n')
  }
  if (SERVER.secure === true) {
    const options = {
      key  : SERVER.ssl.key,
      cert : SERVER.ssl.cert
    }
    https.createServer(options, app).listen(SERVER.port)
    process.stdout.write(` - Aplicación ejecutándose: [${SERVER.env}] https://localhost:${SERVER.port}\n\n`)
  } else {
    app.listen(SERVER.port)
    process.stdout.write(` - Aplicación ejecutándose: [${SERVER.env}] http://localhost:${SERVER.port}\n\n`)
  }
}

module.exports = Insac
