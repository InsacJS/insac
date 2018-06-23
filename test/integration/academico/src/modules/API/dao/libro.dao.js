const { Dao } = require(global.INSAC)

module.exports = (app) => {
  const LIBRO = app.API.models.libro
  const DAO = new Dao(LIBRO)

  return DAO
}
