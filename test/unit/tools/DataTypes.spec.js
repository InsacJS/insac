'use strict'
const DataTypes = require('../../../lib/tools/DataTypes')
const DataType = require('../../../lib/datatypes/DataType')
const String = require('../../../lib/datatypes/String')
const Integer = require('../../../lib/datatypes/Integer')

describe('\n - Clase: DataTypes\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando de un objeto de tipo String 1ra forma', () => {
      let dataType = DataTypes.STRING()
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType instanceof String).to.equal(true)
      expect(dataType.args[0]).to.equal(255)
    })
    it('Instanciando de un objeto de tipo String 1ra forma', () => {
      let dataType = DataTypes.STRING(100)
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType instanceof String).to.equal(true)
      expect(dataType.args.length).to.equal(1)
      expect(dataType.args[0]).to.equal(100)
    })
    it('Instanciando de un objeto de tipo Integer', () => {
      let dataType = DataTypes.INTEGER()
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType instanceof Integer).to.equal(true)
      expect(dataType.args.length).to.equal(0)
    })
  })

})
