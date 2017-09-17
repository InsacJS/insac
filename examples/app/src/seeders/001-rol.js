'use strict'
const { Seed } = require(INSAC)

module.exports = (insac) => {

  let data = insac.config.auth.roles

  return new Seed('rol', data)
}
