const { Insac } = require(global.INSAC)

const service = new Insac()

service.addModule('API')

service.init()

module.exports = service
