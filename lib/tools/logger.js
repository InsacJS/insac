/** @ignore */ const winston = require('winston')
/** @ignore */ const path    = require('path')
/** @ignore */ const fs      = require('fs')
/** @ignore */ const mkdirp  = require('mkdirp')
/** @ignore */ const moment  = require('moment')

/** @ignore */ const DIRNAME  = 'logs'
/** @ignore */ const FILENAME = 'app.log'

/** @ignore */ const DIR_PATH  = path.resolve(process.cwd(), DIRNAME)
/** @ignore */ const FILE_PATH = path.resolve(DIR_PATH, FILENAME)

if (!fs.existsSync(DIR_PATH)) { mkdirp.sync(DIR_PATH) }

/** @ignore */ const LOGGER = new winston.Logger({
  transports: [
    new winston.transports.File({
      timestamp        : () => moment().format('DD/MM/YYYY HH:MM:SS'),
      level            : 'info',
      filename         : FILE_PATH,
      handleExceptions : false,
      json             : false,
      maxsize          : 5242880,
      maxFiles         : 5,
      colorize         : false
    }),
    new winston.transports.Console({
      level            : 'debug',
      handleExceptions : false,
      json             : false,
      colorize         : true
    })
  ],
  exitOnError: false
})

if (process.env.NODE_ENV && (process.env.NODE_ENV !== 'development')) {
  LOGGER.remove(winston.transports.Console)
}

module.exports = LOGGER
