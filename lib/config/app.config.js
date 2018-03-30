const path = require('path')
const _    = require('lodash')
const util = require('../tools/util')

const APP_CONFIG_PATH = path.resolve(process.cwd(), 'src/config/app.config.js')
const config          = util.isFile(APP_CONFIG_PATH) ? require(APP_CONFIG_PATH) : {}

// |=============================================================|
// |------------ CONFIGURACIÓN DE LA BASE DE DATOS --------------|
// |=============================================================|

const LOGGING = sql => process.stdout.write(`\n\x1b[2m${sql}\x1b[0m\n`)

exports.DATABASE = _.merge({
  username : process.env.DB_USER || 'postgres',
  password : process.env.DB_PASS || 'postgres',
  database : process.env.DB_NAME || 'postgres',
  params   : {
    dialect          : 'postgres',
    host             : process.env.DB_HOST_NAME || '127.0.0.1',
    port             : process.env.DB_HOST_PORT || '5432',
    timezone         : '-04:00',
    lang             : 'es',
    logging          : (process.env.LOGGER_SQL && process.env.LOGGER_SQL === 'true') ? LOGGING : false,
    operatorsAliases : false,
    define           : {
      underscored     : true,
      freezeTableName : true,
      timestamps      : true,
      paranoid        : true,
      createdAt       : '_fecha_creacion',
      updatedAt       : '_fecha_modificacion',
      deletedAt       : '_fecha_eliminacion'
    }
  }
}, config.DATABASE || {})

// |=============================================================|
// |------------ CONFIGURACIÓN DEL SERVIDOR ---------------------|
// |=============================================================|

exports.SERVER = _.merge({
  port : process.env.PORT     || 4000,
  env  : process.env.NODE_ENV || 'development',
  cors : {
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  },
  ssl: {
    key  : undefined,
    cert : undefined
  },
  https: false
}, config.SERVER || {})
