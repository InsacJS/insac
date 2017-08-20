'use strict'
const path = require('path')

global.PROJECT_PATH = path.join(__dirname, '..')

let config = {
  general: {
    modelsPath: path.join(PROJECT_PATH, 'models'),
    routesPath: path.join(PROJECT_PATH, 'routes'),
    middlewaresPath: path.join(PROJECT_PATH, 'middlewares'),
    seedersPath: path.join(PROJECT_PATH, 'seeders')
  },
  response: {
    all200: true
  },
  server: {
    port: 3200
  },
  database: {
    dbname: 'insac_app_02',
    username: 'postgres',
    password: 'BK8DJ567F0'
  },
  auth: {
    jwtSecret: 'JWT_SECRET'
  }
}

module.exports = config
