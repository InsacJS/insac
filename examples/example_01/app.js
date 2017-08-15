'use strict'
const insac = require('../../')
const config = require('./config/config')

// Creación del servicio
let app = insac.createServer(config)

// Adición de modelos.
app.addModel('persona')
app.addModel('docente')
app.addModel('estudiante')
app.addModel('auxiliar')
app.addModel('materia')
app.addModel('inscripcion')

// Adición de rutas.
app.addRoutes()

// Creación de tablas.
//app.migrate().then(result => {

  // Inicio de la aplicación
  app.init()
//})
module.exports = app
