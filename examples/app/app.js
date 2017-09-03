const path = require('path')
global.INSAC = path.resolve(__dirname, '../../')

const { Insac, Reference } = require(INSAC)

let app = new Insac('development', __dirname)

app.addModel('usuario')
app.addModel('persona')

app.addRoutes()

app.migrate().then(() => {
  app.seed().then(() => {
    app.listen(7000)
  })
})
