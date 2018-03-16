const cors       = require('cors')
const path       = require('path')
const express    = require('express')
const bodyParser = require('body-parser')
const Response   = require('response-handler').Response
const util       = require('../tools/util')
const _          = require('lodash')

const CONFIG_PATH = path.resolve(process.cwd(), 'src/config/index.js')
const config      = util.isFile(CONFIG_PATH) ? require(CONFIG_PATH) : {}

config.SERVER = config.SERVER || {}

module.exports = (app) => {
  app.use(Response.error({
    onError      : Response.onError,
    errorFormat  : Response.errorFormat,
    errorHandler : Response.errorHandler
  }))
  app.use(bodyParser.json())
  app.use(express.static('public'))
  app.use(cors(_.merge({
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  }, config.SERVER.cors)))
}
