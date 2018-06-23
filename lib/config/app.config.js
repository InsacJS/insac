const _    = require('lodash')
const util = require('../tools/util')

const PROJECT_PATH = process.env.PROJECT_PATH || process.cwd()

let config = {}
util.find(PROJECT_PATH, 'app.config.js', ({ filePath, fileName }) => { if (fileName === '') { config = require(filePath) } })

const SQL_LOG_ENABLED = process.env.SQL_LOG && process.env.SQL_LOG === 'true'

// |=============================================================|
// |------------ CONFIGURACIÓN DE LA BASE DE DATOS --------------|
// |=============================================================|

config.DATABASE = _.merge({
  username : process.env.DB_USER || 'postgres',
  password : process.env.DB_PASS || 'postgres',
  database : process.env.DB_NAME || '_example',
  params   : {
    dialect          : 'postgres',
    storage          : '_example.sqlite', // Solo para sqlite
    host             : process.env.DB_HOST_NAME || '127.0.0.1',
    port             : process.env.DB_HOST_PORT || 5432,
    timezone         : '+00:00',
    lang             : 'es',
    logging          : SQL_LOG_ENABLED ? sql => console.log(`\x1b[2m\n${sql}\x1b[0m\n`) : false,
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

config.DATABASE.params.port = parseInt(config.DATABASE.params.port)
if (config.DATABASE.params.dialect === 'sqlite') { delete config.DATABASE.params.timezone }

// |=============================================================|
// |------------ CONFIGURACIÓN DEL SERVIDOR ---------------------|
// |=============================================================|

config.SERVER = _.merge({
  port : process.env.PORT     || 4000,
  env  : process.env.NODE_ENV || 'development',
  cors : {
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  },
  options: {
    key  : undefined,
    cert : undefined
  },
  https: false
}, config.SERVER || {})

config.SERVER.port = parseInt(config.SERVER.port)

module.exports = config
