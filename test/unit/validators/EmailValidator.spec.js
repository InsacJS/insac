'use strict'
const Validator = require('../../../lib/validators/Validator')
const EmailValidator = require('../../../lib/validators/EmailValidator')

describe('\n - Clase: EmailValidator\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando de un objeto sin parámetros', () => {
      let min_default = 1, max_default = 255
      let validator = new EmailValidator()
      expect(validator instanceof EmailValidator).to.equal(true)
      expect(validator instanceof Validator).to.equal(true)
      expect(validator.min).to.equal(min_default)
      expect(validator.max).to.equal(max_default)
      expect(validator.args.length).to.equal(2)
      expect(validator.args[0]).to.equal(min_default)
      expect(validator.args[1]).to.equal(max_default)
    })
    it('Instanciando de un objeto con parámetros', () => {
      let min = 10, max = 100
      let validator = new EmailValidator(min, max)
      expect(validator instanceof EmailValidator).to.equal(true)
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
      let validator = new EmailValidator(min, max)
      let result = validator.validate('admin@gmail.com')
      expect(result).to.have.property('isValid', true)
      expect(result).to.have.property('value', 'admin@gmail.com')
      expect(result).to.have.property('message', 'El campo es válido')
    })
    it('Verificando la validación 2da forma', () => {
      let min = 10, max = 100
      let validator = new EmailValidator(min, max)
      let result = validator.validate('admingmail.com')
      expect(result).to.have.property('isValid', false)
      expect(result).to.have.property('value', 'admingmail.com')
      expect(result).to.have.property('message', 'Debe ser una dirección de email válida')
    })
    it('Verificando la validación 2da forma', () => {
      let min = 1, max = 10
      let validator = new EmailValidator(min, max)
      let result = validator.validate('admin@gmail.com')
      expect(result).to.have.property('isValid', false)
      expect(result).to.have.property('value', 'admin@gmail.com')
      expect(result).to.have.property('message', 'Debe ser una cadena de texto entre 1 y 10 caracteres')
    })
  })

})
