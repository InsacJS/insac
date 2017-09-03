'use strict'
const DataType = require('../../../lib/datatypes/DataType')
const String = require('../../../lib/datatypes/String')
const StringValidator = require('../../../lib/validators/StringValidator')

describe('\n - Clase: String\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto sin parámetros', () => {
      let dataType = new String()
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType.args.length).to.equal(1)
      expect(dataType.args[0]).to.equal(255)
    })
    it('Instanciando un objeto con parámetros', () => {
      let dataType = new String(100)
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType.args.length).to.equal(1)
      expect(dataType.args[0]).to.equal(100)
    })
  })

  describe(` Método: validator`, () => {
    it('Verificando validador por defecto sin parámetros', () => {
      let dataType = new String()
      let validator = dataType.validator()
      expect(validator instanceof StringValidator).to.equal(true)
      expect(validator.min).to.equal(1)
      expect(validator.max).to.equal(255)
    })
    it('Verificando validador por defecto con parámetros', () => {
      let dataType = new String(100)
      let validator = dataType.validator()
      expect(validator instanceof StringValidator).to.equal(true)
      expect(validator.min).to.equal(1)
      expect(validator.max).to.equal(100)
    })
  })

  describe(` Método: sequelize`, () => {
    it('Verificando el objeto sequelize sin parámetros', () => {
      let dataType = new String()
      let sequelizeType = dataType.sequelize()
      expect(typeof sequelizeType).to.equal('object')
      expect(sequelizeType._length).to.equal(255)
    })
    it('Verificando el objeto sequelize con parámetros', () => {
      const Sequelize = require('sequelize')
      let dataType = new String(100)
      let sequelizeType = dataType.sequelize()
      expect(typeof sequelizeType).to.equal('object')
      expect(sequelizeType._length).to.equal(100)
    })
  })

})
