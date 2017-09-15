'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac, models) => {

  return new Model('persona', {
    fields: {
      nombre: Fields.STRING(),
      id_usuario: Fields.ONE_TO_ONE(models.usuario, {allowNull:false})
    }
  })

}
