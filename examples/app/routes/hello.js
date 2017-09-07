'use strict'
const { Field, DataTypes } = require(INSAC)

module.exports = (insac, models, db) => {

  insac.addRoute('GET', '/hello', {
    output: {
      msg: new Field({type:DataTypes.STRING()})
    },
    controller: (req, res, next) => {
      let data = {
        msg: 'Bienvenido al mundo real'
      }
      res.success200(data)
    }
  })

}
