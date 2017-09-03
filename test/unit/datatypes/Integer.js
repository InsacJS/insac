'use strict'
const DataType = require('../../../lib/datatypes/DataType')
const Integer = require('../../../lib/datatypes/Integer')
const IntegerValidator = require('../../../lib/validators/IntegerValidator')

describe('\n - Clase: Integer\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto', () => {
      let dataType = new Integer()
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType.args.length).to.equal(0)
    })
  })

  describe(` Método: validator`, () => {
    it('Verificando validador por defecto', () => {
      let dataType = new Integer()
      let validator = dataType.validator()
      expect(validator instanceof IntegerValidator).to.equal(true)
      expect(validator.min).to.equal(1)
      expect(validator.max).to.equal(2147483647)
    })
  })

  describe(` Método: sequelize`, () => {
    it('Verificando el objeto sequelize', () => {
      let dataType = new Integer()
      let sequelizeType = dataType.sequelize()
      expect(typeof sequelizeType).to.equal('object')
    })
  })

})
