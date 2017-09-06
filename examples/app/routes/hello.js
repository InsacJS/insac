'use strict'
const { Field } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('GET', '/hello', {
    output: {
      msg: Field.THIS
    },
    controller: (req, res, next) => {
      let data = {
        msg: 'Bienvenido al mundo real'
      }
      res.success200(data)
    }
  })

}
