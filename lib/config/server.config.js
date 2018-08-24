/**
* Configuración por defecto del servidor.
* @type {Object}
* @param {Boolean} [start]         - Habilita la carga de los componentes del servidor.
* @param {Boolean} [listen]        - Habilita el listen del servidor cuando se ejecuta la aplicación.
* @param {String}  [protocol]      - Protocolo.
* @param {String}  [hostname]      - Nombre del host.
* @param {String}  [port]          - Puerto del servidor.
* @param {String}  [env]           - Entorno de ejecución.
* @param {Boolean} [cors]          - Habilita los cors.
* @param {Object}  [corsOptions]   - Configuración de los cors.
*                                    Mas información en: https://github.com/expressjs/cors
* @param {Boolean} [helmet]        - Habilita la librería helmet.
* @param {Object}  [helmetOptions] - Configuración de helmet.
*                                    Mas información en: https://github.com/helmetjs/helmet
* @param {Boolean} [https]         - Habilita la ejecución por https.
* @param {Object}  [httpsOptions]  - Opciones de configuración del servidor cuando se ejecuta por https.
*/
const SERVER = {
  start  : true,
  listen : true,

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
