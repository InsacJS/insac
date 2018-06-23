const chai = require('chai')

global.INSAC = `${__dirname}/../`

process.env.LOG      = 'false'
process.env.LISTEN   = 'false'

// process.env.NODE_ENV = 'test'
// process.env.PORT     = 4001

// process.env.DB_USER      = 'postgres'
// process.env.DB_PASS      = '12345678'
// process.env.DB_NAME      = 'insac_test'
// process.env.DB_HOST_NAME = '127.0.0.1'
// process.env.DB_HOST_PORT = '5432'

global.expect = chai.expect
