'use strict'
const { Config } = require(INSAC)

module.exports = () => {

  return new Config({
    env: 'production',
    database: {
      name: 'insac_sauron_production',
      username: 'postgres',
      password: '12345678'
    },
    server: {
      all200: false
    }
  })

}
