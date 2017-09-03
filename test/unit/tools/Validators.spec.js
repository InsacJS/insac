'use strict'
const Validators = require('../../../lib/tools/Validators')
const Validator = require('../../../lib/validators/Validator')
const StringValidator = require('../../../lib/validators/StringValidator')
const IntegerValidator = require('../../../lib/validators/IntegerValidator')

describe('\n - Clase: Validators\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando de un validador de tipo StringValidator 1ra forma', () => {
      let validator = Validators.STRING()
      expect(validator instanceof Validator).to.equal(true)
      expect(validator instanceof StringValidator).to.equal(true)
      expect(validator.min).to.equal(1)
      expect(validator.max).to.equal(255)
      expect(validator.args.length).to.equal(2)
      expect(validator.args[0]).to.equal(1)
      expect(validator.args[1]).to.equal(255)
    })
    it('Instanciando de un validador de tipo StringValidator 1ra forma', () => {
      let validator = Validators.STRING(10, 100)
      expect(validator instanceof Validator).to.equal(true)
      expect(validator instanceof StringValidator).to.equal(true)
      expect(validator.min).to.equal(10)
      expect(validator.max).to.equal(100)
      expect(validator.args.length).to.equal(2)
      expect(validator.args[0]).to.equal(10)
      expect(validator.args[1]).to.equal(100)
    })
    it('Instanciando de un validador de tipo IntegerValidator', () => {
      let validator = Validators.INTEGER()
      expect(validator instanceof Validator).to.equal(true)
      expect(validator instanceof IntegerValidator).to.equal(true)
      expect(validator.min).to.equal(1)
      expect(validator.max).to.equal(2147483647)
      expect(validator.args.length).to.equal(2)
      expect(validator.args[0]).to.equal(1)
      expect(validator.args[1]).to.equal(2147483647)
    })
  })

})
