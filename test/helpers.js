'use strict'
const path = require('path')
const chai = require("chai")

global.INSAC = path.resolve(__dirname, './../index.js')

global.TEST_PORT = 7001
global.TEST_DB_NAME = 'insac_test'
global.TEST_DB_USER = 'postgres'
global.TEST_DB_PASS = '12345678'

global.expect = chai.expect
