const PORT     = process.env.PORT     = process.env.PORT     || 4001
const NODE_ENV = process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const SERVER = {
  port : PORT,
  env  : NODE_ENV,
  cors : {
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  },
  options: {
    key  : undefined,
    cert : undefined
  },
  https: false
}

module.exports = SERVER
