const { Insac } = require(global.INSAC)

const app = module.exports = new Insac()

app.addModule('API')

app.init()
