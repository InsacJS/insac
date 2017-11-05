'use strict'
const path = require('path')
global.INSAC = path.resolve(__dirname, './../..')
const { Insac, Config } = require(INSAC)

// Esto es solo para hacer pruebas con este ejemplo,
// actualiza la ruta por defecto del proyecto
Config.DEFAULT_PROJECT_PATH = __dirname

// Crea la aplicación
let app = new Insac()

// Carga los modelos, middlewares, recursos y rutas.
app.load()

async function init() {
  app.addSeeders()
  await app.createApidoc()
  await app.migrate()
  await app.seed()
  app.listen()
}

init()
