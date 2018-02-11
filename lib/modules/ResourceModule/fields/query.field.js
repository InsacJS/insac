const { Field } = require('insac-field')

module.exports = (fieldContainer, Sequelize) => {
  return fieldContainer.define('query', {
    fields: Field.STRING({
      comment: 'Campos a devolver en el resultado.',
      example: 'id_usuario,username,persona(id_persona,nombres)'
    }),
    search: Field.STRING({
      comment: 'Palabra a buscar en los registros',
      example: 'perez'
    }),
    order: Field.STRING({
      comment: 'Orden en el que se devolverá el resultado.',
      example: 'apellido,-nombres'
    }),
    limit: Field.INTEGER({
      comment: 'Límite de registros por página.',
      defaultValue: 50
    }),
    page: Field.INTEGER({
      comment: 'Número de página de una lista de registros.',
      defaultValue: 1
    })
  })
}
