/**
* Configuración por defecto de logger.
* @type {Object}
* @param {Boolean} [enabled] - Habilita los logs.
* @param {Boolean} [colors]  - Habilita los colores de los logs.
* @param {Object}  [console] - Configuración de la salida en la consola.
* @param {Object}  [file]    - Configuración de la salida en ficheros.
* @param {Object}  [include] - Configura el registro de los datos de entrada y salida.
*/
const LOGGER = {
  enabled : true,
  colors  : true,

  console: {
    timestamp : true, // Muestra el timestamp
    reqId     : true, // Muestra el id de la petición
    transport : {
      level : 'info', // Nivel de detalle
      json  : false
    }
  },

  file: {
    // fatal: 0, error: 1, warn: 2, notice: 3, info: 4, verbose: 5, debug: 6, silly: 7
    levels    : ['error', 'warn', 'info'],
    transport : {
      json     : true,
      maxsize  : 5242880,
      maxFiles : 5
    }
  },

  // Habilita el registro de los datos de entrada y salida
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
