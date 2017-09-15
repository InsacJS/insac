'use strict'
const Validator = require('../../../lib/validators/Validator')
const StringValidator = require('../../../lib/validators/StringValidator')

describe('\n - Clase: StringValidator\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando de un objeto sin parámetros', () => {
      let min_default = 1, max_default = 255
      let validator = new StringValidator()
      expect(validator instanceof StringValidator).to.equal(true)
      expect(validator instanceof Validator).to.equal(true)
      expect(validator.min).to.equal(min_default)
      expect(validator.max).to.equal(max_default)
      expect(validator.args.length).to.equal(2)
      expect(validator.args[0]).to.equal(min_default)
      expect(validator.args[1]).to.equal(max_default)
    })
    it('Instanciando de un objeto con parámetros', () => {
      let min = 10, max = 100
      let validator = new StringValidator(min, max)
      expect(validator instanceof StringValidator).to.equal(true)
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
      let min = 2, max = 100
      let validator = new StringValidator(min, max)
      let result = validator.validate('abc')
      expect(result).to.have.property('isValid', true)
      expect(result).to.have.property('value', 'abc')
      expect(result).to.have.property('message', 'El campo es válido')
    })
    it('Verificando la validación 2da forma', () => {
      let min = 10, max = 100
      let validator = new StringValidator(min, max)
      let result = validator.validate('abc')
      expect(result).to.have.property('isValid', false)
      expect(result).to.have.property('value', 'abc')
      expect(result).to.have.property('message')
    })
    it('Verificando la validación 3ra forma', () => {
      let min = 10, max = 100
      let validator = new StringValidator(min, max)
      let result = validator.validate(true)
      expect(result).to.have.property('isValid', false)
      expect(result).to.have.property('value', true)
      expect(result).to.have.property('message')
    })
  })

})
