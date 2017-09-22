'use strict'
const Validator = require('../../../lib/validators/Validator')
const DateValidator = require('../../../lib/validators/DateValidator')

describe('\n - Clase: DateValidator\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando de un objeto sin parámetros', () => {
      let validator = new DateValidator()
      expect(validator instanceof DateValidator).to.equal(true)
      expect(validator instanceof Validator).to.equal(true)
      expect(validator.args.length).to.equal(0)
    })
  })

  describe(` Método: validate`, () => {
    it('Verificando una validación 1ra forma', () => {
      let validator = new DateValidator()
      let result = validator.validate('2017-09-11')
      expect(result).to.have.property('isValid', true)
      expect(result).to.have.property('value', '2017-09-11')
      expect(result).to.have.property('message', 'El campo es válido')
    })
    it('Verificando la validación 2da forma', () => {
      let validator = new DateValidator()
      let result = validator.validate('11/09/2017S')
      expect(result).to.have.property('isValid', false)
      expect(result).to.have.property('value', '11/09/2017S')
      expect(result).to.have.property('message', 'Debe tener el formato de una fecha válida')
    })
    it('Verificando la validación 3da forma', () => {
      let validator = new DateValidator()
      let result = validator.validate('11/09/2017 08:10:25')
      expect(result).to.have.property('isValid', true)
      expect(result).to.have.property('value',  '11/09/2017 08:10:25')
      expect(result).to.have.property('message', 'El campo es válido')
    })
    it('Verificando la validación 3da forma', () => {
      let validator = new DateValidator()
      let result = validator.validate('Tue Nov 21 2017 14:10:25 GMT-0400 (BOT)')
      expect(result).to.have.property('isValid', true)
      expect(result).to.have.property('value',  'Tue Nov 21 2017 14:10:25 GMT-0400 (BOT)')
      expect(result).to.have.property('message', 'El campo es válido')
    })
  })

})
