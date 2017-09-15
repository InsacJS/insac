'use strict'
const DataType = require('../../../lib/datatypes/DataType')

describe('\n - Clase: DataType\n', () => {

  describe(` Método: constructor`, () => {
    it('Instancia de un objeto STRING', () => {
      let dataType = new DataType('STRING', [255])
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType.args.length).to.equal(1)
      expect(dataType.args[0]).to.equal(255)
    })
    it('Instancia de un objeto INTEGER', () => {
      let dataType = new DataType('INTEGER', [])
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType.args.length).to.equal(0)
    })
    it('Instancia de un objeto CUSTOM', () => {
      let dataType = new DataType('CUSTOM', [1, 2, 3])
      expect(dataType instanceof DataType).to.equal(true)
      expect(dataType.args.length).to.equal(3)
      expect(dataType.args[0]).to.equal(1)
      expect(dataType.args[1]).to.equal(2)
      expect(dataType.args[2]).to.equal(3)
    })
  })

})
