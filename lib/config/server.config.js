/** @ignore */ const PROTOCOL = process.env.PROTOCOL = process.env.PROTOCOL || 'http'
/** @ignore */ const HOSTNAME = process.env.HOSTNAME = process.env.HOSTNAME || 'localhost'
/** @ignore */ const PORT     = process.env.PORT     = process.env.PORT     || 4000
/** @ignore */ const NODE_ENV = process.env.NODE_ENV = process.env.NODE_ENV || 'development'

/**
* Configuración del servidor.
* @type {Object}
* @param {String} [protocol] - Protocolo (http o https)
* @param {String} [hostname] - Nombre del host.
* @param {String} [port]     - Puerto del servidor.
* @param {String} [env]      - Entorno de ejecución.
* @param {Object} [cors]     - Configuración de los cors.
*                              Mas información en: https://github.com/expressjs/cors
* @param {Object} [helmet]   - Configuración de seguridad.
*                              Mas información en: https://github.com/helmetjs/helmet
* @param {Object} [options]  - Opciones de configuración del servidor cuando se ejecuta por https.
* @param {Boolean} [https]   - Indica si el potocolo https está activado.
*/
const SERVER = {
  protocol : PROTOCOL,
  hostname : HOSTNAME,
  port     : PORT,
  env      : NODE_ENV,

  cors: {
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  },

  helmet: {},

  options: {
    key  : null,
    cert : null
  },

  https: PROTOCOL === 'https'
}

SERVER.port = parseInt(SERVER.port)

module.exports = SERVER
