'use strict'
/** @ignore */ const fs = require('fs')
/** @ignore */ const Route = require('./Route')

/**
* Describe las caractersiticas y comportamiento de una ruta de tipo PUT
*/
class RoutePut extends Route {

  /**
  * Crea una instacia de la clase RoutePut.
  * @param {String} path URI de la ruta.
  * @param {Objet} options Opciones de configuración de la ruta. Ver {@link Route#constructor}
  */
  constructor(path, options = {}) {
    super('PUT', path, options)
  }

  /**
  * Devuelve una función de tipo callback que describe todo el comportamiento de la ruta PUT.
  * @param {Model[]} models Modelos de la aplicación.
  * @param {Object} db Objeto que contiene todos los modelos sequelize, una instancia y una referencia de la clase Sequelize.
  * @return {Function}
  * @override
  */
  getCallback(models, db) {
    let options = { include: [ { all: true } ] }
    return (req, res, next) => {
      res.options = options
      this.controller(req, res, next)
    }
  }

}

module.exports = RoutePut
