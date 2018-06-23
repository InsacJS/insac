module.exports = (app) => {
  const INPUT = {}

  INPUT.get = async (req, res, next) => {
    try {
      return res.success200({ msg: 'OK' })
    } catch (e) { return next(e) }
  }

  return INPUT
}
