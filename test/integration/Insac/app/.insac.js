'use strict'

module.exports = {
  path: {
    config: './config',
    middlewares: './middlewares',
    models: './models',
    routes: './routes',
    resources: './resources',
    seeders: './seeders'
  },
  server: {
    port: TEST_PORT
  },
  one: 'ONE',
  two: {
    prop: 'TWO'
  },
  database: {
    name: TEST_DB_NAME,
    username: TEST_DB_USER,
    password: TEST_DB_PASS
  }
}
