/**
* Configuración del servidor.
* @type {Object}
* @param {String} [protocol]       - Protocolo.
* @param {String} [hostname]       - Nombre del host.
* @param {String} [port]           - Puerto del servidor.
* @param {String} [env]            - Entorno de ejecución.
* @param {Boolean} [cors]          - Indica si está habilitada la configuración para los cors.
* @param {Object}  [corsOptions]   - Configuración de los cors.
*                                    Mas información en: https://github.com/expressjs/cors
* @param {Boolean} [helmet]        - Indica si está habilitada la configuración para helmet.
* @param {Object}  [helmetOptions] - Configuración de seguridad.
*                                    Mas información en: https://github.com/helmetjs/helmet
* @param {Boolean} [https]         - Indica si el potocolo https está activado.
* @param {Object}  [httpsOptions]  - Opciones de configuración del servidor cuando se ejecuta por https.
*/
const SERVER = {
  start: true,

  protocol : 'http',
  hostname : 'localhost',
  port     : 4000,
  env      : 'development',

  cors        : true,
  corsOptions : {
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  },

  helmet        : true,
  helmetOptions : {},

  https        : false,
  httpsOptions : {}
}

module.exports = SERVER
