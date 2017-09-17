'use strict'
const { Route, Fields } = require(INSAC)

module.exports = (insac, models, db) => {

  return new Route('GET', '/hello', {
    group: 'Custom',
    title: 'Hello',
    rol: 'admin',
    output: {
      msg: Fields.STRING({description:'Mensaje de bienvenida', allowNull:true})
    },
    middlewares: [
      { name:'auth', args:{ rol:'admin' } }
    ],
    controller: (req) => {
      return { msg: `Bienvenido al mundo real`, token: req.token }
    }
  })

}
