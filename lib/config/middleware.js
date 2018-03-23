const cors       = require('cors')
const express    = require('express')
const bodyParser = require('body-parser')
const Response   = require('response-handler').Response
const _          = require('lodash')

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
