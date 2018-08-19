/** @ignore */ const path       = require('path')
/** @ignore */ const _          = require('lodash')
/** @ignore */ const helmet     = require('helmet')
/** @ignore */ const uuid       = require('uuid/v4')
/** @ignore */ const bodyParser = require('body-parser')
/** @ignore */ const cors       = require('cors')
/** @ignore */ const express    = require('express')

/** @ignore */ const Response = require('../libs/ResponseHandler')
/** @ignore */ const util     = require('../tools/util')

module.exports = (app) => {
  // |======================================================================|
  // |----------- TAREAS A REALIZAR ANTES DE CARGAR LOS MÓDULOS ------------|
  // |======================================================================|

  // Asigna un identificador único.
  app.use((req, res, next) => {
    req.id      = uuid()
    req.startAt = Date.now()
    return next()
  })

  // Adiciona los métodos para controlar errores.
  app.use(Response.error({ errorFormat: app.config.RESPONSE.errorFormat, all200: app.config.RESPONSE.all200 }))

  // Convierte el contenido del body a JSON.
  app.use(bodyParser.json())

  // Controla de seguridad.
  app.use(cors(app.config.SERVER.cors))
  app.use(helmet(app.config.SERVER.helmet))

  // Activa la carpeta publica.
  app.use(express.static(app.config.PATH.public))

  // Define la página de inicio.
  const compile   = _.template(util.readFile(path.resolve(__dirname, 'home/index.html')))
  const INFO      = _.cloneDeep(app.config.PROJECT)
  INFO.modules    = app.apidoc.isEnabled() ? app.getResourceModules() : []
  const indexPage = compile(INFO)
  app.get('/', (req, res, next) => {
    res.status(200).send(indexPage)
  })

  // Muestra logs de los datos de entrada.
  app.use((req, res, next) => {
    app.logger.requestPath(req)
    return next()
  })

  // Adiciona fields personalizados a la librería FieldCreator
  require('./field')
}
