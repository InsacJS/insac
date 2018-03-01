const OP = require('sequelize').Op

/**
* Clase Dao (Data Access Object).
*/
class Dao {
  /**
  * Crea una instancia.
  * @param {SequelizeModel} model - Modelo Sequelize.
  */
  constructor (model) {
    /**
    * Modelo.
    * @type{SequelizeModel}
    */
    this.model = model
  }

  /**
  * Devuelve un registro.[
  * @param {Transaction} t         - Transacción
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _findOne (t, options = {}) {
    options.transaction = t
    return this.model.findOne(options)
  }

  /**
  * Devuelve una lista de[ ]registros.
  * @param {Transaction} t         - Transacción
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _findAll (t, options = {}) {
    options.transaction = t
    return this.model.findAll(options)
  }

  /**
  * Devuelve el número de[ ]registros existentes.
  * @param {Transaction} t         - Transacción
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _count (t, options = {}) {
    options.transaction = t
    return this.model.count(options)
  }

  /**
  * Devuelve una lista de[ ]registros y la cantidad de registros existentes..
  * @param {Transaction} t         - Transacción
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _findAndCountAll (t, options = {}) {
    options.transaction = t
    return this.model.findAndCountAll(options)
  }

  /**
  * Crea un registro.
  * @param {Transaction} [t]       - Transacción
  * @param {!Object}     data      - Datos del registro.
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _create (t, data, options = {}) {
    options.transaction = t
    return this.model.create(data, options)
  }

  /**
  * Actualiza un registro.
  * @param {Transaction} [t]       - Transacción
  * @param {!Object}     data      - Datos del registro.
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _update (t, data, options = {}) {
    options.transaction = t
    return this.model.update(data, options)
  }

  /**
  * Elimina un registro.
  * @param {Transaction} [t]       - Transacción
  * @param {!Object}     data      - Datos del registro.
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _destroy (t, options = {}) {
    options.transaction = t
    return this.model.destroy(options)
  }

  /**
  * Devuelve un registro.
  * @param {Transaction} [t]             - Transacción
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {Boolean}     [paranoid=true] - Indica si se tomará en cuenta los registros eliminados.
  * @return {Promise}
  */
  findOne (t, where, not, paranoid = true) {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    return this.model.findOne(options)
  }

  /**
  * Devuelve una lista de registros.
  * @param {Transaction} [t]             - Transacción
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {Boolean}     [paranoid=true] - Indica si se tomará en cuenta los registros eliminados.
  * @return {Promise}
  */
  findAll (t, where, not, paranoid = true) {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    return this.model.findAll(options)
  }

  /**
  * Devuelve la cantidad de registros existentes.
  * @param {Transaction} [t]             - Transacción
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {Boolean}     [paranoid=true] - Indica si se tomará en cuenta los registros eliminados.
  * @return {Promise}
  */
  count (t, where, not, paranoid = true) {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    return this.model.count(options)
  }

  /**
  * Devuelve una lista de registros y la cantidad de registros existentes.
  * @param {Transaction} [t]             - Transacción
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {Boolean}     [paranoid=true] - Indica si se tomará en cuenta los registros eliminados.
  * @return {Promise}
  */
  findAndCountAll (t, where, not, paranoid = true) {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    return this.model.findAndCountAll(options)
  }

  /**
  * Crea un registro.
  * @param {Transaction} [t]  - Transacción
  * @param {!Object}     data - Datos del registro.
  * @return {Promise}
  */
  create (t, data) {
    const options = { transaction: t }
    return this.model.create(data, options)
  }

  /**
  * Actualiza un registro.
  * @param {Transaction} [t]             - Transacción
  * @param {!Object}     data            - Datos del registro.
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {Boolean}     [paranoid=true] - Indica si se tomará en cuenta los registros eliminados.
  * @return {Promise}
  */
  update (t, data, where, not, paranoid = true) {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    return this.model.update(data, options)
  }

  /**
  * Elimina un registro.
  * @param {Transaction} [t]             - Transacción
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {Boolean}     [paranoid=true] - Indica si se tomará en cuenta los registros eliminados.
  * @return {Promise}
  */
  destroy (t, where, not, paranoid = true) {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    return this.model.destroy(options)
  }
}

module.exports = Dao
