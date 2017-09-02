'use strict'
const Validator = require('../../../lib/validators/Validator')
const INTEGER_VALIDATOR = require('../../../lib/validators/INTEGER_VALIDATOR')

describe('\n - Clase: INTEGER_VALIDATOR\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando de un objeto sin parámetros', () => {
      let min_default = 1, max_default = 2147483647
      let validator = new INTEGER_VALIDATOR()
      expect(validator instanceof INTEGER_VALIDATOR).to.equal(true)
      expect(validator instanceof Validator).to.equal(true)
      expect(validator.min).to.equal(min_default)
      expect(validator.max).to.equal(max_default)
      expect(validator.args.length).to.equal(2)
      expect(validator.args[0]).to.equal(min_default)
      expect(validator.args[1]).to.equal(max_default)
    })
    it('Instanciando de un objeto con parámetros', () => {
      let min = 10, max = 100
      let validator = new INTEGER_VALIDATOR(min, max)
      expect(validator instanceof INTEGER_VALIDATOR).to.equal(true)
      expect(validator instanceof Validator).to.equal(true)
      expect(validator.min).to.equal(min)
      expect(validator.max).to.equal(max)
      expect(validator.args.length).to.equal(2)
      expect(validator.args[0]).to.equal(min)
      expect(validator.args[1]).to.equal(max)
    })
  })

})
