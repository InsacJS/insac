const { Insac } = require(global.INSAC)

const app = module.exports = new Insac()

app.addModule('AUTH')
app.addModule('API')

app.init()
