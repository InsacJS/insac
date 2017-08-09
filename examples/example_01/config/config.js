'use strict'
const path = require('path')

global.PROJECT_PATH = path.join(__dirname, '..')

let config = {
  general: {
    modelsPath: path.join(PROJECT_PATH, 'models'),
    routesPath: path.join(PROJECT_PATH, 'routes')
  },
  server: {
    port: 3200
  },
  database: {
    dbname: 'insac_app_01',
    username: 'postgres',
    password: 'BK8DJ567F0'
  }
}

module.exports = config
