'use strict'

class Generator {

  constructor(models, db) {
    this.models = models
    this.db = db
  }

  /**
  * Devuelve un objeto options con todos los atributos e includes necesarios para realizar una consulta sequelize.
  */
  queryOptions(route) {
    if (!route.model) { return }
    let output = Array.isArray(route.output) ? route.output[0] : route.output
    let subInclude = route.model.includeOptions(output, this.models, this.db, "")
    let attributes = route.model.attributesOptions(output, "")
    let options = { attributes: attributes }
    if (subInclude.length > 0) {
      options.include = subInclude
    }
    return options
  }

}

module.exports = Generator
