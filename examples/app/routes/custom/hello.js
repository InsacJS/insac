'use strict'
const { Field, DataTypes } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('GET', '/hello', {
    output: {
      msg: Field.STRING({description:'Mensaje de bienvenida'})
    },
    controller: (req, res, next) => {
      return { msg: 'Bienvenido al mundo real' }
    }
  })

}
