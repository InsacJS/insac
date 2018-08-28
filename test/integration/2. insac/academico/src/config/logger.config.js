const path = require('path')

const LOGGER = {
  colors: true,

  console: {
    timestamp : true,
    reqId     : true,
    transport : {
      level: 'verbose'
    }
  },

  file: {
    logsPath  : path.resolve(__dirname, '../../custom-logs'),
    levels    : ['fatal', 'error', 'warn', 'notice', 'info', 'verbose'],
    transport : {
      maxsize  : 5242880,
      maxFiles : 5
    }
  },

  include: {
    input: {
      headers : false,
      params  : true,
      query   : true,
      body    : true
    },

    output: {
      data: false
    }
  }
}

module.exports = LOGGER
