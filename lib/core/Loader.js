/** @ignore */ const _ = require('lodash')

/**
* Muestra mensajes para aquellas tareas de larga duración.
*/
class Loader {
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
    try {
      if (process.env.LOG && process.env.LOG === 'false') return
      if (this.finished === false) {
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(`\x1b[2m${this.msg} \x1b[0m${_.padEnd('', this.dotCount, '.')}`)
        process.stdout.cursorTo(0)
        this.dotCount = (this.dotCount + 1) % this.dotLenth
        await this._timer(this.dotDelta)
        await this.start()
      }
    } catch (e) { }
  }

  /**
  * Finaliza la tarea.
  * Adicionalmente se puede indicar un mensaje que aparecerá al final.
  * @param {String} msg Mensaje adicional.
  * @return {Promise}
  */
  async finish (msg = '') {
    try {
      if (process.env.LOG && process.env.LOG === 'false') return
      this.finished = true
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      process.stdout.write(`\x1b[2m${this.msg} \x1b[0m\u2713\n${msg}`)
    } catch (e) { }
  }

  /**
  * La tarea no pudo ser completada.
  * Adicionalmente se puede indicar un mensaje que aparecerá al final.
  * @param {String} msg Mensaje adicional.
  * @return {Promise}
  */
  async failed (msg = '') {
    try {
      if (process.env.LOG && process.env.LOG === 'false') return
      this.finished = true
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      process.stdout.write(`\x1b[2m${this.msg} \x1b[0m\u2715\n${msg}`)
    } catch (e) { }
  }

  /**
  * Devuelve una promesa que simula una tarea.
  * @param {NUmber} timeout - Tiempo de espera.
  * @return {Promise}
  */
  _timer (timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => { resolve() }, timeout)
    })
  }
}

module.exports = Loader
