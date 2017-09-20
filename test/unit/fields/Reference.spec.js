'use strict'
const Field = require('../../../lib/fields/Field')
const Reference = require('../../../lib/fields/Reference')
const STRING = require('../../../lib/datatypes/STRING')

describe('\n - Clase: Reference\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto con parámetros', () => {
      let model = 'usuario', type = Reference.ONE_TO_MANY
      let field = new Reference({required: true}, {model, undefined, type})
      expect(field instanceof Field).to.equal(true)
      expect(field.type instanceof STRING).to.equal(true)
      expect(field.description).to.equal('')
      expect(field.required).to.equal(true)
      expect(field.primaryKey).to.equal(false)
      expect(field.autoIncrement).to.equal(false)
      expect(field.defaultValue).to.equal(undefined)
      expect(typeof field.reference).to.equal('object')
      expect(field.reference.model).to.equal(model)
      expect(field.reference.as).to.equal('usuario')
      expect(field.reference.type).to.equal(type)
      expect(field.reference.key).to.equal('id')
    })
  })

  describe(` Método: sequelize`, () => {
    it('Verificando el objeto sequelize de un field de tipo referencia', () => {
      let model = 'usuario', as = 'usuario_personalizado', type = '1:N', key = 'key'
      let field = new Reference({required: true}, {model, as, type, key})
      let sequelizeField = field.sequelize()
      expect(typeof sequelizeField.type).to.equal('object')
      expect(sequelizeField.allowNull).to.equal(false)
      expect(sequelizeField.primaryKey).to.equal(false)
      expect(sequelizeField.autoIncrement).to.equal(false)
      expect(sequelizeField.defaultValue).to.equal(undefined)
      expect(typeof sequelizeField.references).to.equal('object')
      expect(sequelizeField.references.model).to.equal(model)
      expect(sequelizeField.references.as).to.equal(as)
      expect(sequelizeField.references.key).to.equal(key)
    })
  })

})