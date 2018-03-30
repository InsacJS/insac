/** @ignore */ const OP = require('sequelize').Op

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
    * @type {SequelizeModel}
    */
    this.model = model
  }

  /**
  * Devuelve un registro.[
  * @param {Transaction} t         - Transacción.
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _findOne (t, options = {}) {
    options.transaction = t
    return this.model.findOne(options)
  }

  /**
  * Devuelve una lista de[ ]registros.
  * @param {Transaction} t         - Transacción.
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _findAll (t, options = {}) {
    options.transaction = t
    return this.model.findAll(options)
  }

  /**
  * Devuelve el número de[ ]registros existentes.
  * @param {Transaction} t         - Transacción.
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _count (t, options = {}) {
    options.transaction = t
    return this.model.count(options)
  }

  /**
  * Devuelve una lista de[ ]registros y la cantidad de registros existentes..
  * @param {Transaction} t         - Transacción.
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _findAndCountAll (t, options = {}) {
    options.transaction = t
    return this.model.findAndCountAll(options)
  }

  /**
  * Crea un registro.
  * @param {Transaction} [t]       - Transacción.
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
  * @param {Transaction} [t]       - Transacción.
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
  * @param {Transaction} [t]       - Transacción.
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _destroy (t, options = {}) {
    options.transaction = t
    return this.model.destroy(options)
  }

  /**
  * Restaura un registro.
  * @param {Transaction} [t]       - Transacción.
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _restore (t, options = {}) {
    options.transaction = t
    return this.model.restore(options)
  }

  /**
  * Devuelve un registro.
  * @param {Transaction} [t]             - Transacción.
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {Boolean}     [paranoid=true] - Indica si se excluirán los registros eliminados.
  * @param {String[]}    [include=[]]    - Associaciones a incluir.
  * @return {Promise}
  */
  findOne (t, where, not, paranoid = true, include = []) {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    if (include.length > 0) {
      options.include = []
      include.forEach(association => { options.include.push({ association }) })
    }
    return this.model.findOne(options)
  }

  /**
  * Devuelve una lista de registros.
  * @param {Transaction} [t]             - Transacción.
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {Boolean}     [paranoid=true] - Indica si se excluirán los registros eliminados.
  * @param {String[]}    [include=[]]    - Associaciones a incluir.
  * @return {Promise}
  */
  findAll (t, where, not, paranoid = true, include = []) {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    if (include.length > 0) {
      options.include = []
      include.forEach(association => { options.include.push({ association }) })
    }
    return this.model.findAll(options)
  }

  /**
  * Devuelve la cantidad de registros existentes.
  * @param {Transaction} [t]             - Transacción.
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {Boolean}     [paranoid=true] - Indica si se excluirán los registros eliminados.
  * @param {String[]}    [include=[]]    - Associaciones a incluir.
  * @return {Promise}
  */
  count (t, where, not, paranoid = true, include = []) {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    if (include.length > 0) {
      options.include = []
      include.forEach(association => { options.include.push({ association }) })
    }
    return this.model.count(options)
  }

  /**
  * Devuelve una lista de registros y la cantidad de registros existentes.
  * @param {Transaction} [t]             - Transacción.
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {Boolean}     [paranoid=true] - Indica si se excluirán los registros eliminados.
  * @param {String[]}    [include=[]]    - Associaciones a incluir.
  * @return {Promise}
  */
  findAndCountAll (t, where, not, paranoid = true, include = []) {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    if (include.length > 0) {
      options.include = []
      include.forEach(association => { options.include.push({ association }) })
    }
    return this.model.findAndCountAll(options)
  }

  /**
  * Crea un registro.
  * @param {Transaction} [t]  - Transacción.
  * @param {!Object}     data - Datos del registro.
  * @return {Promise}
  */
  create (t, data) {
    const options = { transaction: t }
    return this.model.create(data, options)
  }

  /**
  * Actualiza un registro.
  * @param {Transaction} [t]             - Transacción.
  * @param {!Object}     data            - Datos del registro.
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {Boolean}     [paranoid=true] - Indica si se excluirán los registros eliminados.
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
  * @param {Transaction} [t]             - Transacción.
  * @param {Object}      [data]          - Datos a modificar antes de eliminar.
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {Boolean}     [paranoid=true] - Indica si se excluirán los registros eliminados.
  * @return {Promise}
  */
  async destroy (t, data, where, not, paranoid = true) {
    const options = { transaction: t, paranoid: false }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    if (data) { await this.model.update(data, options) }
    if (paranoid === false) { options.force = true }
    return this.model.destroy(options)
  }

  /**
  * Restaura un registro.
  * @param {Transaction} [t]             - Transacción..
  * @param {Object}      [data]          - Datos a modificar antes de restaurar.
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @return {Promise}
  */
  async restore (t, data, where, not) {
    const options = { transaction: t, paranoid: false }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    if (data) { await this.model.update(data, options) }
    options.paranoid = true
    return this.model.restore(options)
  }
}

module.exports = Dao
