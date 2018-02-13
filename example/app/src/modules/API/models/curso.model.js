const { Field } = require(global.INSAC)

module.exports = (sequelize, Sequelize) => {
  return sequelize.define('curso', {
    id_curso: Field.ID(),
    nombre: Field.STRING(100, {
      example: 'Arquitectura de Sistemas',
      validate: { len: [3, 100] }
    }),
    categoria: Field.STRING(100, {
      example: 'Programación',
      validate: { len: { args: [3, 100], msg: 'La categoría debe tener entre 3 y 100 caracteres.' } }
    })
  })
}
