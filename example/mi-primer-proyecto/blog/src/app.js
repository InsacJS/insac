const { Insac } = require('insac')

const service = new Insac()

service.addModule('API')
// <!-- [CLI] - [MODULE] --!> //

service.init().catch(e => {
  console.error(e)
  process.exit(1)
})

module.exports = service
