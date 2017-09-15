'use strict'
const DataType = require('../../../lib/datatypes/DataType')
const DATE = require('../../../lib/datatypes/DATE')
const DateValidator = require('../../../lib/validators/DateValidator')

describe('\n - Clase: DATE\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto sin parámetros', () => {
      let dataType = new DATE()
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType.args.length).to.equal(0)
    })
  })

  describe(` Método: validator`, () => {
    it('Verificando validador por defecto sin parámetros', () => {
      let dataType = new DATE()
      let validator = dataType.validator()
      expect(validator instanceof DateValidator).to.equal(true)
    })
  })

  describe(` Método: val`, () => {
    it('Verificando el parseo de datos', () => {
      let dataType = new DATE()
      expect(dataType.val('12/08/2017')).to.equal('Fri Dec 08 2017 00:00:00 GMT-0400 (BOT)')
      expect(dataType.val('Fri Dec 08 2017 00:00:00 GMT-0400 (BOT)')).to.equal('Fri Dec 08 2017 00:00:00 GMT-0400 (BOT)')
    })
  })

  describe(` Método: sequelize`, () => {
    it('Verificando el objeto sequelize sin parámetros', () => {
      let dataType = new DATE()
      let sequelizeType = dataType.sequelize()
      expect(typeof sequelizeType).to.equal('object')
    })
  })

})
