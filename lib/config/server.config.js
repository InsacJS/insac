/**
* Configuración por defecto del servidor.
* @type {Object}
* @property {Boolean} start=true           - Habilita la carga de los componentes del servidor.
* @property {Boolean} listen=true          - Habilita el listen del servidor cuando se ejecuta la aplicación.
* @property {String}  protocol='http'      - Protocolo. Valor asignado automáticamente según la propiedad 'SERVER.https'
* @property {String}  hostname='localhost' - Nombre del host.
* @property {String}  port=4000            - Puerto del servidor.
* @property {String}  env='development'    - Entorno de ejecución.
* @property {Boolean} cors=true            - Habilita los cors.
* @property {Object}  corsOptions          - Configuración de los cors. Mas información en: https://github.com/expressjs/cors
* @property {Boolean} helmet=true          - Habilita la librería helmet.
* @property {Object}  helmetOptions        - Configuración de helmet. Mas información en: https://github.com/helmetjs/helmet
* @property {Boolean} https=false          - Habilita la ejecución por https.
* @property {Object}  httpsOptions         - Opciones de configuración del servidor cuando se ejecuta por https.
*/
const SERVER = {
  start  : true,
  listen : true,

  protocol : 'http',
  hostname : 'localhost',
  port     : 4000,
  env      : 'development',

  // https://github.com/expressjs/cors#configuration-options
  cors        : true,
  corsOptions : {
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  },

  // https://helmetjs.github.io/docs/
  helmet        : true,
  helmetOptions : {},

  // https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
  https        : false,
  httpsOptions : {}
}

module.exports = SERVER
