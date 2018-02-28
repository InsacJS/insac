const winston = require('winston')
const path    = require('path')
const fs      = require('fs')
const mkdirp  = require('mkdirp')
const moment  = require('moment')

const DIRNAME  = 'logs'
const FILENAME = 'app.log'

const DIR_PATH  = path.resolve(process.cwd(), DIRNAME)
const FILE_PATH = path.resolve(DIR_PATH, FILENAME)

if (!fs.existsSync(DIR_PATH)) { mkdirp.sync(DIR_PATH) }

const LOGGER = new winston.Logger({
  transports: [
    new winston.transports.File({
      timestamp        : () => moment().format('DD/MM/YYYY HH:MM:SS'),
      level            : 'info',
      filename         : FILE_PATH,
      handleExceptions : true,
      json             : true,
      maxsize          : 5242880,
      maxFiles         : 5,
      colorize         : false
    }),
    new winston.transports.Console({
      level            : 'debug',
      handleExceptions : true,
      json             : process.env.LOGGER_JSON && process.env.LOGGER_JSON === 'true',
      colorize         : true
    })
  ],
  exitOnError: false
})

if (process.env.NODE_ENV && (process.env.NODE_ENV !== 'development')) {
  LOGGER.remove(winston.transports.Console)
}

module.exports = LOGGER
