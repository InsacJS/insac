'use strict'
const Validator = require('../../../lib/validators/Validator')
const IntegerValidator = require('../../../lib/validators/IntegerValidator')

describe('\n - Clase: IntegerValidator\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando de un objeto sin parámetros', () => {
      let min_default = 1, max_default = 2147483647
      let validator = new IntegerValidator()
      expect(validator instanceof IntegerValidator).to.equal(true)
      expect(validator instanceof Validator).to.equal(true)
      expect(validator.min).to.equal(min_default)
      expect(validator.max).to.equal(max_default)
      expect(validator.args.length).to.equal(2)
      expect(validator.args[0]).to.equal(min_default)
      expect(validator.args[1]).to.equal(max_default)
    })
    it('Instanciando de un objeto con parámetros', () => {
      let min = 10, max = 100
      let validator = new IntegerValidator(min, max)
      expect(validator instanceof IntegerValidator).to.equal(true)
      expect(validator instanceof Validator).to.equal(true)
      expect(validator.min).to.equal(min)
      expect(validator.max).to.equal(max)
      expect(validator.args.length).to.equal(2)
      expect(validator.args[0]).to.equal(min)
      expect(validator.args[1]).to.equal(max)
    })
  })

  describe(` Método: validate`, () => {
    it('Verificando una validación 1ra forma', () => {
      let min = 10, max = 100
      let validator = new IntegerValidator(min, max)
      let result = validator.validate(50)
      expect(result).to.have.property('isValid', true)
      expect(result).to.have.property('value', 50)
      expect(result).to.have.property('message', 'El campo es válido')
    })
    it('Verificando la validación 2da forma', () => {
      let min = 10, max = 100
      let validator = new IntegerValidator(min, max)
      let result = validator.validate(500)
      expect(result).to.have.property('isValid', false)
      expect(result).to.have.property('value', 500)
      expect(result).to.have.property('message')
    })
    it('Verificando la validación 3ra forma', () => {
      let min = 10, max = 100
      let validator = new IntegerValidator(min, max)
      let result = validator.validate(true)
      expect(result).to.have.property('isValid', false)
      expect(result).to.have.property('value', true)
      expect(result).to.have.property('message')
    })
  })

})
