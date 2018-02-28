const express = require('express')
const dotenv  = require('dotenv')
const util    = require('./tools/util')
const Task    = require('./tools/Task')

/*!
* insac
* Copyright(c) 2018 Alex Quispe
* MIT License
*/
class Insac {
  constructor () {
    process.stdout.write(`\x1b[32m\n |===============================================|\n`)
    process.stdout.write(` |======  \x1b[33m I N S A C   F R A M E W O R K \x1b[32m  ======|\n`)
    process.stdout.write(` |===============================================|\n\x1b[0m\n`)

    this.app = express()

    /**
    * |=============================================================|
    * |------------ VARIABLES DE ENTORNO ---------------------------|
    * |=============================================================|
    */
    dotenv.config(process.env)

    /**
    * |=============================================================|
    * |------------ CONFIGURACIÓN INICIAL --------------------------|
    * |=============================================================|
    */
    require('./boot/database')(this.app)
    require('./boot/apidoc')(this.app)
    require('./boot/fields')(this.app)
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
        this.app[MODULE_NAME] = require(filePath)(this.app)
        this.app.MODULES.push(MODULE_NAME)
      }
    })
  }

  async init () {
    try {
      if (process.env.SETUP && process.env.SETUP === 'true') {
        await _setup(this.app)
      }
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
    } catch (err) { process.stdout.write(`${err}\n`) }
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
  process.exit(0)
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
  await app.listen(process.env.PORT)
  process.stdout.write(` - Aplicación ejecutándose en modo '${process.env.NODE_ENV}' sobre el puerto ${process.env.PORT}\n\n`)
}

module.exports = Insac
