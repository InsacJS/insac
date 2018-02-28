/** @ignore */ const _ = require('lodash')

/**
* Muestra mensajes para aquellas tareas de larga duración.
*/
class Task {
  /**
  * Crea una instancia.
  * @param {String} msg - Mensaje a mostrar en la terminal.
  */
  constructor (msg) {
    /**
    * Mensaje
    * @type {String}
    */
    this.msg = msg

    /**
    * Estado que indica si la taréa ha finalizado.
    * @type {Boolean}
    */
    this.finished = false

    /**
    * Cantidad de puntos.
    * @type {Number}
    */
    this.dotLenth = 6

    /**
    * Contador de puntos.
    * @type {Number}
    */
    this.dotCount = 0

    /**
    * Tiempo de aparición de los puntos.
    * @type {String}
    */
    this.dotDelta = 200
  }

  /**
  * Inicia la tarea.
  * @return {Promise}
  */
  async start () {
    if (this.finished === false) {
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      process.stdout.write(`\x1b[2m${this.msg} \x1b[0m${_.padEnd('', this.dotCount, '.')}`)
      process.stdout.cursorTo(0)
      this.dotCount = (this.dotCount + 1) % this.dotLenth
      await _sleep(this.dotDelta)
      await this.start()
    }
  }

  /**
  * Finaliza la tarea.
  * Adicionalmente se puede indicar un mensaje que aparecerá al final.
  * @param {String} msg Mensaje adicional.
  * @return {Promise}
  */
  async finish (msg = '') {
    this.finished = true
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(`\x1b[2m${this.msg} \x1b[0m\u2713\n${msg}`)
  }
}

/**
* Devuelve una promesa que simula una tarea.
* @param {NUmber} timeout - Tiempo de espera.
*/
function _sleep (timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve() }, timeout)
  })
}

module.exports = Task
