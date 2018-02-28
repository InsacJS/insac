exports.create = (app, model) => {
  const OP  = app.DB.Sequelize.Op
  const DAO = {}

  DAO._findOne = async (t, options = {}) => {
    options.transaction = t
    return model.findOne(options)
  }

  DAO._findAll = async (t, options = {}) => {
    options.transaction = t
    return model.findAll(options)
  }

  DAO._count = async (t, options = {}) => {
    options.transaction = t
    return model.count(options)
  }

  DAO._findAndCountAll = async (t, options = {}) => {
    options.transaction = t
    return model.findAndCountAll(options)
  }

  DAO._create = async (t, data, options = {}) => {
    options.transaction = t
    return model.create(data, options)
  }

  DAO._update = async (t, data, options = {}) => {
    options.transaction = t
    return model.update(data, options)
  }

  DAO._destroy = async (t, options = {}) => {
    options.transaction = t
    return model.destroy(options)
  }

  DAO.findOne = async (t, where, not, paranoid = true) => {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    return model.findOne(options)
  }

  DAO.findAll = async (t, where, not, paranoid = true) => {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    return model.findAll(options)
  }

  DAO.count = async (t, where, not, paranoid = true) => {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    return model.count(options)
  }

  DAO.findAndCountAll = async (t, where, not, paranoid = true) => {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    return model.findAndCountAll(options)
  }

  DAO.create = async (t, data) => {
    const options = { transaction: t }
    return model.create(data, options)
  }

  DAO.update = async (t, data, where, not, paranoid = true) => {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    return model.update(data, options)
  }

  DAO.destroy = async (t, where, not, paranoid = true) => {
    const options = { transaction: t, paranoid }
    if (where) { options.where = where }
    if (not) {
      options.where = where || {}
      options.where[OP.not] = not
    }
    return model.destroy(options)
  }

  return DAO
}
