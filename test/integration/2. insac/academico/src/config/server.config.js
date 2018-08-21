const SERVER = {
  port : process.env.PORT     || 4001,
  env  : process.env.NODE_ENV || 'development',

  cors        : true,
  corsOptions : {
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  }
}

module.exports = SERVER
