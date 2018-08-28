const { Field } = require(global.INSAC)

module.exports = (app) => {
  const OUTPUT = {}

  OUTPUT.hello = {
    message : Field.STRING(),
    number  : Field.INTEGER()
  }

  return OUTPUT
}
