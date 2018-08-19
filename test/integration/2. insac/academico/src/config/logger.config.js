const LOGGER = {
  console: {
    enabled   : false,
    timestamp : true,
    reqId     : true,
    transport : {
      level : 'debug',
      json  : false
    }
  },

  file: {
    levels    : ['fatal', 'error', 'warn', 'notice', 'info', 'verbose'],
    transport : {
      json     : true,
      maxsize  : 5242880,
      maxFiles : 5
    }
  },

  include: {
    request: {
      path: true
    },

    response: {
      success  : true,
      error    : true,
      error500 : true
    },

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
