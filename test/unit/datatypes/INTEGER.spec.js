'use strict'
const DataType = require('../../../lib/datatypes/DataType')
const INTEGER = require('../../../lib/datatypes/INTEGER')
const INTEGER_VALIDATOR = require('../../../lib/validators/INTEGER_VALIDATOR')

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
      expect(validator instanceof INTEGER_VALIDATOR).to.equal(true)
      expect(validator.min).to.equal(1)
      expect(validator.max).to.equal(2147483647)
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
