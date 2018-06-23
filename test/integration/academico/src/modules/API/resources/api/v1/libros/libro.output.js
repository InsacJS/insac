const { Field } = require(global.INSAC)

module.exports = (app) => {
  const OUTPUT = {}

  OUTPUT.get = {
    msg: Field.STRING()
  }

  return OUTPUT
}
