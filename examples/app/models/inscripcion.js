'use strict'
const { Reference, DataTypes } = require(INSAC)

module.exports = (insac, models) => {

  insac.addModel('inscripcion', {
    fields: {
      gestion: { type: DataTypes.INTEGER() },
      id_persona: Reference.ONE_TO_MANY(models.persona),
      id_materia: Reference.ONE_TO_MANY(models.materia)
    },
    options: {
      plural: 'inscripciones'
    }
  })

}
