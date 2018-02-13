const { Field } = require('insac-field')

module.exports = (fieldContainer, Sequelize) => {
  return fieldContainer.define('auth', {
    authorization: Field.STRING(500, {
      comment: 'Token de acceso.',
      example: 'Bearer eyJ0eXAiOiJKV.eyJpZF91c3VhcmlvI-z55A',
      allowNull: false
    })
  })
}
