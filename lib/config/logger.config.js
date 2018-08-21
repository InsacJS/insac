/**
* Configuración de logger.
* @type {Object}
* @param {Boolean} [enabled] - Habilita los logs.
* @param {Boolean} [colors]  - Habilita los colores de los logs.
* @param {Object}  [console] - Configuración de la salida en la consola.
* @param {Object}  [file]    - Configuración de la salida en ficheros.
* @param {Object}  [include] - Configura los logs personalizados que serán registrados.
*/
const LOGGER = {
  enabled : true,
  colors  : true,

  console: {
    timestamp : true,
    reqId     : true,
    transport : {
      level : 'info',
      json  : false
    }
  },

  file: {
    levels    : ['fatal', 'error', 'warn', 'notice', 'info'],
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
