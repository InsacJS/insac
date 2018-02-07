const { Field } = require(global.INSAC)

module.exports = (sequelize, Sequelize) => {
  return sequelize.define('curso', {
    id_curso: Field.ID(),
    nombre: Field.STRING(100, { example: 'Arquitectura de Sistemas' }),
    categoria: Field.STRING(100, { example: 'Programación' })
  })
}
