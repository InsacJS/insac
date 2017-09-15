'use strict'
const { Config } = require(INSAC)

module.exports = () => {

  return new Config({
    env: 'test',
    database: {
      name: 'insac_sauron_test',
      username: 'postgres',
      password: '12345678'
    },
    server: {
      all200: false
    }
  })

}
