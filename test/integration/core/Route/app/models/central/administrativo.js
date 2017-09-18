'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac, models) => {

  return new Model('administrativo', {
    description: 'Modelo que representa a un personal administrativo',
    fields: {
      cargo: Fields.STRING({
        description: 'Cargo o puesto administrativo'
      }),
      id_persona: Fields.ONE_TO_ONE(models.persona, {required:true})
    }
  })

}
