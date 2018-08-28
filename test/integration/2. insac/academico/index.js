process.env.LOGS_PATH    = `${__dirname}/custom-logs`
process.env.PUBLIC_PATH  = `${__dirname}/custom-public`

const { Insac } = require(global.INSAC)

const service = new Insac()

service.addModule('API')
service.addModule('AUTH')

service.init().catch(e => {
  console.log(e)
})

module.exports = service
