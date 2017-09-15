'use strict'
const path = require('path')
global.INSAC = path.resolve(__dirname, './../..')
const { Insac, Config } = require(INSAC)

// Esto es solo para hacer pruebas con este ejemplo,
// actualiza la ruta por defecto del proyecto
Config.DEFAULT_PROJECT_PATH = __dirname

let app = new Insac()

app.addModel('rol')
app.addModel('usuario')
app.addModel('rol_usuario')
app.addModel('persona')
app.addModel('carrera')
app.addModel('administrativo')
app.addModel('docente')
app.addModel('estudiante')

app.addMiddlewares()
app.addRoutes()
app.addResources()
app.addSeeders()

app.migrate().then(() => {
 app.seed().then(() => {
  app.listen()
 })
})
