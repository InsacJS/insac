'use strict'

module.exports = (insac, models) => {

  insac.addModel('usuario', {
    fields: {
      username: { allowNull: false },
      password: undefined
    },
    options: {
      uniqueKeys: ['username']
    }
  })

}
