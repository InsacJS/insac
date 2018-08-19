const { Field } = require(global.INSAC)

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
