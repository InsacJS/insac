const logger = require('../tools/logger')

module.exports = (app) => {
  // |======================================================================|
  // |----------- TAREAS A REALIZAR ANTES DE CARGAR LOS MÓDULOS ------------|
  // |======================================================================|

  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') { return next() }
    logger.requestPath(req)
    logger.requestQuery(req)
    logger.requestHeaders(req)
    logger.requestBody(req)
    return next()
  })
}
