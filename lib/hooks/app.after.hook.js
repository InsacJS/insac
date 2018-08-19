/** @ignore */ const errors = require('../tools/errors')

/** @ignore */ const { NotFound, BadRequest, InternalServer } = errors

module.exports = (app) => {
  // |======================================================================|
  // |----------- TAREAS A REALIZAR DESPUÉS DE CARGAR LOS MÓDULOS ----------|
  // |======================================================================|

  // Controla el método OPTIONS y las rutas no definidas.
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      return res.status(200).send('ok')
    }
    return next(new NotFound({
      dev: `La ruta ${req.method.toUpperCase()} '${req.originalUrl}' no ha sido definida.`
    }))
  })

  // Controla los errores
  app.use((err, req, res, next) => {
    if (err && (err.name === 'InputDataValidationError')) {
      err = BadRequest.create(err.errors)
    }

    if (err instanceof SyntaxError) {
      err = BadRequest.create('Error de sintaxis, posiblemente en el formato JSON.')
    }

    if (err && (err.name !== 'ResponseHandlerError')) {
      err = InternalServer.create(err)
    }

    if (err.code === 500) {
      app.logger.responseError500(req, err)
    } else {
      app.logger.responseError(req, err)
    }

    return res.error(err)
  })
}
