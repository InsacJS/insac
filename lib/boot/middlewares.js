const cors       = require('cors')
const express    = require('express')
const bodyParser = require('body-parser')
const Response   = require('response-handler').Response

module.exports = (app) => {
  app.use(Response.error({
    onError      : Response.onError,
    errorFormat  : Response.errorFormat,
    errorHandler : Response.errorHandler
  }))
  app.use(bodyParser.json())
  app.use(express.static('public'))
  app.use(cors({
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  }))
  app.use(bodyParser.json())
}
