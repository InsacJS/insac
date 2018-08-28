module.exports = (app) => {
  const CONTROLLER = {}

  CONTROLLER.hello = async (req, res, next) => {
    try {
      const NAME   = req.params.name
      const NUMBER = req.query.number
      const RESULT = { message: `Hola ${NAME}!!!`, number: NUMBER }
      res.success200(RESULT, 'Mensaje enviado exitosamente.')
    } catch (err) { return next(err) }
  }

  return CONTROLLER
}
