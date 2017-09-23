'use strict'
const { Model, Fields, Validators } = require(INSAC)

module.exports = (insac, models, db) => {

  return new Model('docente', {
    description: 'Modelo que representa a un docente',
    fields: {
      item: Fields.INTEGER({
        description: 'Nro de item'
      }),
      grado: Fields.STRING({
        description: 'Grado académico'
      }),
      carga_horaria: Fields.INTEGER({
        description: 'Carga horaria'
      }),
      tipo_contratacion: Fields.STRING({
        description: 'Tipo de contratación',
        validator: Validators.IN(['TITULAR','INTERINO','INVITADO']),
        defaultValue: 'TITULAR'
      }),
      tipo_docente: Fields.STRING({
        description: 'Tipo de indica si es docente: investigador, de cátedra, o ambos',
        validator: Validators.IN(['A','B','C']),
        defaultValue: 'A'
      }),
      id_persona: Fields.ONE_TO_ONE(models.persona)
    }
  })

}
