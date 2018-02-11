const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const _ = require('lodash')

class Insac {
  constructor () {
    console.log(`\x1b[32m\n |===============================================|`)
    console.log(` |======  \x1b[33m I N S A C   F R A M E W O R K \x1b[32m  ======|`)
    console.log(` |===============================================|\n\x1b[0m`)

    this.app = express()

    /**
    * |=============================================================|
    * |------------ VARIABLES DE ENTORNO ---------------------------|
    * |=============================================================|
    */
    dotenv.config(process.env)

    /**
    * |=============================================================|
    * |------------ VARIABLES GLOBALES -----------------------------|
    * |=============================================================|
    */
    global.UTIL = require(path.resolve(__dirname, './utils/UTIL'))
    global.LOGGER = require(path.resolve(__dirname, './utils/LOGGER'))

    /**
    * |=============================================================|
    * |------------ CONFIGURACIÓN INICIAL --------------------------|
    * |=============================================================|
    */
    require(path.resolve(__dirname, './core/Response'))(this.app)
    require(path.resolve(__dirname, './core/Database'))(this.app)
    require(path.resolve(__dirname, './core/Apidoc'))(this.app)

    /**
    * |=============================================================|
    * |------------ MODULOS ----------------------------------------|
    * |=============================================================|
    */
    this.app.MODULE = {}
  }

  addModule (moduleName) {
    global.UTIL.file.find('src/modules', '.module.js', ({ filePath, fileName, dirPath }) => {
      const MODULE_NAME = fileName.toUpperCase()
      if (MODULE_NAME === moduleName) {
        const CONFIG = { name: MODULE_NAME, path: dirPath }
        this.app.MODULE[MODULE_NAME] = require(filePath)(this.app, CONFIG)
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
    } catch (err) {
      console.log(err)
    }
  }
}

async function _setup (app) {
  console.log(' |===============================================|')
  console.log(' |----------- INSTALANDO APLICACIÓN -------------|')
  console.log(' |===============================================|\n')
  const modules = process.env.MODULE ? process.env.MODULE.split(',') : []
  for (let key in app.MODULE) {
    if ((modules.length === 0) || modules.includes(key)) {
      console.log(_.padEnd(` ========== Módulo ${key} ... `, 50, '=') + '\n')
      await app.MODULE[key].onSetup(app)
      console.log('\n' + _.padEnd(` ---------- ${key} \u2713 `, 50, '-') + '\n')
    }
  }
  console.log(` - Instalación finalizada correctamente.\n`)
  process.exit(0)
}

async function _start (app) {
  console.log(' |===============================================|')
  console.log(' |---------- INICIALIZANDO APLICACIÓN -----------|')
  console.log(' |===============================================|\n')
  for (let key in app.MODULE) {
    console.log(_.padEnd(` ========== Módulo ${key} ... `, 50, '=') + '\n')
    await app.MODULE[key].onStart(app)
    console.log('\n' + _.padEnd(` ---------- ${key} \u2713 `, 50, '-') + '\n')
  }
  if (process.env.CREATE_APIDOC && process.env.CREATE_APIDOC === 'true') {
    console.log(' Construyendo APIDOC ...')
    await app.APIDOC.build()
    console.log(' Apidoc \u2713\n')
  }
  await app.listen(process.env.PORT)
  console.log(` - La aplicación esta ejecutándose en modo '${process.env.NODE_ENV}' sobre el puerto ${process.env.PORT}\n`)
}

module.exports = Insac
