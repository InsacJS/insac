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
  * Devuelve un registro.
  * @param {Transaction} t         - Transacción.
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _findOne (t, options = {}) {
    options.transaction = t
    return this.model.findOne(options)
  }

  /**
  * Devuelve una lista de registros.
  * @param {Transaction} t         - Transacción.
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  _findAll (t, options = {}) {
    options.transaction = t
    return this.model.findAll(options)
  }

  /**
  * Devuelve el número de registros existentes.
  * @param {Transaction} t         - Transacción.
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  async _count (t, options = {}) {
    options.transaction = t
    options.limit  = 1000000000000000000
    options.offset = 0
    return (await this.model.findAll(options)).length
  }

  /**
  * Devuelve una lista de registros y la cantidad de registros existentes.
  * @param {Transaction} t         - Transacción.
  * @param {Object}      [options] - Opciones de consulta.
  * @return {Promise}
  */
  async _findAndCountAll (t, options = {}) {
    options.transaction = t
    const rows = await this.model.findAll(options)
    options.limit  = 1000000000000000000
    options.offset = 0
    const count = (await this.model.findAll(options)).length
    return { count, rows }
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
  * @param {String[]}    [include=[]]    - Associaciones a incluir.
  * @param {Boolean}     [paranoid=true] - Indica si se excluirán los registros eliminados.
  * @return {Promise}
  */
  findOne (t, where, not, include = [], paranoid = true) {
    const options = { transaction: t, paranoid }
    this._wherenot(options, where, not)
    this._include(options, include)
    return this.model.findOne(options)
  }

  /**
  * Devuelve una lista de registros.
  * @param {Transaction} [t]             - Transacción.
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {String[]}    [include=[]]    - Associaciones a incluir.
  * @param {Boolean}     [paranoid=true] - Indica si se excluirán los registros eliminados.
  * @return {Promise}
  */
  findAll (t, where, not, include = [], paranoid = true) {
    const options = { transaction: t, paranoid }
    this._wherenot(options, where, not)
    this._include(options, include)
    return this.model.findAll(options)
  }

  /**
  * Devuelve la cantidad de registros existentes.
  * @param {Transaction} [t]             - Transacción.
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {String[]}    [include=[]]    - Associaciones a incluir.
  * @param {Boolean}     [paranoid=true] - Indica si se excluirán los registros eliminados.
  * @return {Promise}
  */
  async count (t, where, not, include = [], paranoid = true) {
    const options = { transaction: t, paranoid }
    this._wherenot(options, where, not)
    this._include(options, include)
    options.limit  = 1000000000000000000
    options.offset = 0
    return (await this.model.findAll(options)).length
  }

  /**
  * Devuelve una lista de registros y la cantidad de registros existentes.
  * @param {Transaction} [t]             - Transacción.
  * @param {Object}      [where]         - Opción de consulta where.
  * @param {Object}      [not]           - Opción de consulta not.
  * @param {String[]}    [include=[]]    - Associaciones a incluir.
  * @param {Boolean}     [paranoid=true] - Indica si se excluirán los registros eliminados.
  * @return {Promise}
  */
  async findAndCountAll (t, where, not, include = [], paranoid = true) {
    const options = { transaction: t, paranoid }
    this._wherenot(options, where, not)
    this._include(options, include)
    const rows     = await this.model.findAll(options)
    options.limit  = 1000000000000000000
    options.offset = 0
    const count    = (await this.model.findAll(options)).length
    return { count, rows }
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
    this._wherenot(options, where, not)
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
    this._wherenot(options, where, not)
    if (data) { await this.model.update(data, options) }
    if (paranoid === false) { options.force = true }
    return this.model.destroy(options)
  }

  /**
  * Restaura un registro.
  * @param {Transaction} [t]     - Transacción..
  * @param {Object}      [data]  - Datos a modificar antes de restaurar.
  * @param {Object}      [where] - Opción de consulta where.
  * @param {Object}      [not]   - Opción de consulta not.
  * @return {Promise}
  */
  async restore (t, data, where, not) {
    const options = { transaction: t, paranoid: false }
    this._wherenot(options, where, not)
    if (data) { await this.model.update(data, options) }
    options.paranoid = true
    return this.model.restore(options)
  }

  /**
  * Incluye las consultas where y not al objeto options.
  * @param {!Object} options - Objeto options.
  * @param {Object}  [where] - Opción de consulta where.
  * @param {Object}  [not]   - Opción de consulta not.
  */
  _wherenot (options, where, not) {
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
  }

  /**
  * Incluye las asociaciones al objeto options.
  * Si existen asociaciones anidadas, estas deben estar delimitadas por un punto.
  * @param {!Object}  options - Objeto options.
  * @param {String[]} include - Associaciones a incluir.
  */
  _include (options, include = []) {
    if (include && include.length > 0) {
      options.include = []
      include.forEach(association => {
        const models = association.split('.')
        const length = models.length
        function add (opt, i) {
          if (i > length - 1) return
          opt.include  = opt.include || []
          let include  = { association: models[i] }
          let included = false
          opt.include.forEach(inc => { if (inc.association === models[i]) { include = inc; included = true } })
          if (!included) opt.include.push(include)
          add(include, i + 1)
        }
        add(options, 0)
      })
    }
  }
}

module.exports = Dao
