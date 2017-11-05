'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac) => {

  return new Model('persona', {
    fields: {
      nombre: Fields.STRING(),
      id_usuario: Fields.REFERENCE({
        reference: { model:'usuario', key:'id' },
        association: { as:'persona', type:'1:1' }
      })
    }
  })

}
