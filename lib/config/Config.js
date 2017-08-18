'use strict'

let Config = {
  general: {
    locale: 'es'
  },
  response: {
    all200: false
  },
  server: {
    publicPath: null,
    port: 3200,
    url: 'http://localhost:3200'
  },
  database: {
    dbname: 'insac_app',
    username: 'postgres',
    password: 'postgres',
    dialect: 'postgres',
    timezone: '+00:00',
    host: 'localhost',
    port: 5432
  },
  auth: {
    jwtSecret: 'JWT_SECRET'
  }
}

module.exports = Config
