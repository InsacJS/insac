'use strict'
const { Fields } = require(INSAC)

module.exports = (insac, models) => {

  insac.addModel('persona', {
    fields: {
      nombre: {},
      id_usuario: Fields.ONE_TO_ONE(models.usuario, {allowNull:false})
    }
  })

}
