const { Dao } = require(global.INSAC)

module.exports = (app) => {
  const USUARIO = app.AUTH.models.usuario
  const DAO = new Dao(USUARIO)

  return DAO
}
