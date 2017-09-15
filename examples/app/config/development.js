'use strict'
const { Config } = require(INSAC)

module.exports = () => {

  return new Config({
    env: 'development',
    database: {
      name: 'insac_sauron_development',
      username: 'postgres',
      password: '12345678'
    },
    server: {
      all200: false
    }
  })

}
