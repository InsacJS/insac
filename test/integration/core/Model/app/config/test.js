'use strict'
const { Config } = require(INSAC)

module.exports = (config) => {

  return new Config({
    env: 'test',
    database: {
      name: TEST_DB_NAME,
      username: TEST_DB_USER,
      password: TEST_DB_PASS
    }
  })

}
