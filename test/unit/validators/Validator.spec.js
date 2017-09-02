'use strict'
const Validator = require('../../../lib/validators/Validator')

describe('\n - Clase: Validator\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando de un objeto de tipo STRING', () => {
      let validator = new Validator('STRING', [1, 100])
      expect(validator instanceof Validator).to.equal(true)
      expect(validator.args.length).to.equal(2)
      expect(validator.args[0]).to.equal(1)
      expect(validator.args[1]).to.equal(100)
    })
    it('Instanciando de un objeto de tipo INTEGER', () => {
      let validator = new Validator('INTEGER', [1, 100])
      expect(validator instanceof Validator).to.equal(true)
      expect(validator.args.length).to.equal(2)
      expect(validator.args[0]).to.equal(1)
      expect(validator.args[1]).to.equal(100)
    })
  })

})
