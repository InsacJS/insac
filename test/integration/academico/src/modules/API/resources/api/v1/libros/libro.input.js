const { Field } = require(global.INSAC)

module.exports = (app) => {
  const INPUT = {}

  INPUT.get = {
    query: {
      fields: Field.FIELDS
    }
  }

  return INPUT
}
