const { Insac } = require('insac')

const service = new Insac()

service.addModule('api')

service.init().catch(e => {
  console.log(e)
  process.exit(1)
})

module.exports = service
