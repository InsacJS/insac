'use strict'
const DataTypes = require('../../../lib/tools/DataTypes')
const DataType = require('../../../lib/datatypes/DataType')
const STRING = require('../../../lib/datatypes/STRING')
const INTEGER = require('../../../lib/datatypes/INTEGER')

describe('\n - Clase: DataTypes\n', () => {

  describe(` Método (static): STRING`, () => {
    it('Instanciando de un objeto de tipo STRING 1ra forma', () => {
      let dataType = DataTypes.STRING()
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType instanceof STRING).to.equal(true)
      expect(dataType.args[0]).to.equal(255)
    })
    it('Instanciando de un objeto de tipo STRING 1ra forma', () => {
      let dataType = DataTypes.STRING(100)
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType instanceof STRING).to.equal(true)
      expect(dataType.args.length).to.equal(1)
      expect(dataType.args[0]).to.equal(100)
    })
  })

  describe(` Método (static): INTEGER`, () => {
    it('Instanciando de un objeto de tipo INTEGER', () => {
      let dataType = DataTypes.INTEGER()
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType instanceof INTEGER).to.equal(true)
      expect(dataType.args.length).to.equal(0)
    })
  })

})
