/** @ignore */ const cors       = require('cors')
/** @ignore */ const express    = require('express')
/** @ignore */ const bodyParser = require('body-parser')
/** @ignore */ const Response   = require('response-handler').Response
/** @ignore */ const _          = require('lodash')

/**
* Módulo encargado de configurar el servidor.
* @module
*/
module.exports = (app) => {
  app.use(Response.error({ errorFormat: Response.errorFormat }))
  app.use(bodyParser.json())
  app.use(express.static('public'))
  app.use(cors(_.merge({
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  }, app.config.SERVER.cors)))
}
