const { Field } = require(global.INSAC)

module.exports = (sequelize, Sequelize) => {
  const LIBRO = sequelize.define('libro', {
    id     : Field.ID(),
    titulo : Field.STRING()
  }, {
    schema: 'api'
  })

  LIBRO.associations = (app) => { }

  return LIBRO
}
