global.INSAC = require('path').resolve(__dirname, '../..')

const { Insac } = require(global.INSAC)

const service = new Insac()

service.addModule('api')

service.init().catch(e => {
  console.log(e)
  process.exit(1)
})

module.exports = service
