'use strict'
const insac = require('../../')
const config = require('./src/config/config')

// Creación del servicio.
let app = insac.createServer(config)

// Adición de modelos de autenticación.
app.addModel('usuario')
app.addModel('rol')
app.addModel('usuario_rol')
// Adicion de modelos.
app.addModel('persona')
app.addModel('docente')
app.addModel('estudiante')
app.addModel('auxiliar')
app.addModel('materia')
app.addModel('inscripcion')

// Adicion de middlewares predefinidos.
app.addMiddleware('cors')
app.addMiddleware('body-parser-json')
app.addMiddleware('body-parser-url-encoded')

// Adicion de middlewares.
app.addMiddleware('authorization')

// Adición de rutas.
app.addRoutes()

// Adicion de middlewares predefinidos.
app.addMiddleware('error-handler')

// Creación de tablas.
app.migrate().then(result => {
  // Creación datos
  app.seed().then(result => {
    // Iniciar aplicación
    app.init()
  }).catch(err => {
    console.log(err.name)
  })
}).catch(err => {
  console.log(err.name)
})

module.exports = app
