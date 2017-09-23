'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac, models, db) => {

  return new Model('estudiante', {
    description: 'Modelo que representa a un estudiante',
    fields: {
      ru: Fields.INTEGER({
        description: 'Nro de registro universitario'
      }),
      id_persona: Fields.ONE_TO_ONE(models.persona),
      id_carrera: Fields.ONE_TO_MANY(models.carrera)
    }
  })

}
