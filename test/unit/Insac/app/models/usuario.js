'use strict'

module.exports = (insac, models) => {

  insac.addModel('usuario', {
    fields: {
      username: {
        description: 'Usuario'
      },
      password: {
        description: 'Contraseña'
      }
    }
  })

}
