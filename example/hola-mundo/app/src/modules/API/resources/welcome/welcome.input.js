const { Field } = require('insac')

module.exports = (app) => {
  const INPUT = {}

  INPUT.hello = {
    params: {
      name: Field.STRING({ allowNull: false })
    },
    query: {
      number: Field.INTEGER({ allowNull: false })
    }
  }

  return INPUT
}
