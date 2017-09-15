'use strict'
const DataType = require('../../../lib/datatypes/DataType')
const INTEGER = require('../../../lib/datatypes/INTEGER')
const IntegerValidator = require('../../../lib/validators/IntegerValidator')

describe('\n - Clase: INTEGER\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto', () => {
      let dataType = new INTEGER()
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType.args.length).to.equal(0)
    })
  })

  describe(` Método: validator`, () => {
    it('Verificando validador por defecto', () => {
      let dataType = new INTEGER()
      let validator = dataType.validator()
      expect(validator instanceof IntegerValidator).to.equal(true)
      expect(validator.min).to.equal(1)
      expect(validator.max).to.equal(2147483647)
    })
  })

  describe(` Método: val`, () => {
    it('Verificando el parseo de datos', () => {
      let dataType = new INTEGER()
      expect(dataType.val('123')).to.equal(123)
      expect(dataType.val(123)).to.equal(123)
    })
  })

  describe(` Método: sequelize`, () => {
    it('Verificando el objeto sequelize', () => {
      let dataType = new INTEGER()
      let sequelizeType = dataType.sequelize()
      expect(typeof sequelizeType).to.equal('object')
    })
  })

})
