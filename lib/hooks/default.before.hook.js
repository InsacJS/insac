const stdout = require('../tools/stdout')

module.exports = (app) => {
  // |======================================================================|
  // |--- TAREAS A REALIZAR ANTES DE INSTALAR O INICIALIZAR LOS MÓDULOS ----|
  // |======================================================================|

  if (!process.env.REQUEST_LOG || process.env.REQUEST_LOG === 'true') {
    app.use((req, res, next) => {
      if (req.method === 'OPTIONS') { return next() }
      stdout.requestPath(req)
      stdout.requestQuery(req)
      stdout.requestBody(req)
      return next()
    })
  }
}
