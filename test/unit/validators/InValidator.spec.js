'use strict'
const Validator = require('../../../lib/validators/Validator')
const InValidator = require('../../../lib/validators/InValidator')

describe('\n - Clase: InValidator\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando de un objeto sin parámetros', () => {
      let values = ['A','B','C']
      let validator = new InValidator(values)
      expect(validator instanceof InValidator).to.equal(true)
      expect(validator instanceof Validator).to.equal(true)
      expect(validator.values).to.equal(values)
      expect(validator.args.length).to.equal(1)
      expect(validator.args[0]).to.equal(values)
    })
  })

  describe(` Método: validate`, () => {
    it('Verificando una validación 1ra forma', () => {
      let values = ['A','B','C']
      let validator = new InValidator(values)
      let result = validator.validate('A')
      expect(result).to.have.property('isValid', true)
      expect(result).to.have.property('value', 'A')
      expect(result).to.have.property('message', 'El campo es válido')
    })
    it('Verificando la validación 2da forma', () => {
      let values = ['A','B','C']
      let validator = new InValidator(values)
      let result = validator.validate('ALFA')
      expect(result).to.have.property('isValid', false)
      expect(result).to.have.property('value', 'ALFA')
      expect(result).to.have.property('message', 'Valores permitidos: A,B,C')
    })
  })

})
