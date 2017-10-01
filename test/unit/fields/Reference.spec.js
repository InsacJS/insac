'use strict'
const Field = require('../../../lib/fields/Field')
const Fields = require('../../../lib/tools/Fields')
const Model = require('../../../lib/core/Model')
const Reference = require('../../../lib/fields/Reference')
const STRING = require('../../../lib/datatypes/STRING')

describe('\n - Clase: Reference\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto con parámetros', () => {
      let usuario = new Model('usuario', {fields:{nombre:Fields.STRING()}})
      let type = Reference.ONE_TO_MANY
      let field = new Reference({required: true}, {model:usuario, type:type})
      expect(field instanceof Field).to.equal(true)
      expect(field.type instanceof STRING).to.equal(true)
      expect(field.description).to.equal('')
      expect(field.required).to.equal(true)
      expect(field.primaryKey).to.equal(false)
      expect(field.autoIncrement).to.equal(false)
      expect(field.defaultValue).to.equal(undefined)
      expect(typeof field.reference).to.equal('object')
      expect(field.reference.model).to.equal(usuario.name)
      expect(field.reference.as).to.equal('usuario')
      expect(field.reference.type).to.equal(type)
      expect(field.reference.key).to.equal('id')
    })
  })

  describe(` Método: sequelize`, () => {
    it('Verificando el objeto sequelize de un field de tipo referencia', () => {
      let model = new Model('usuario', {fields:{nombre:Fields.STRING()}})
      let as = 'usuario_personalizado', type = '1:N', key = 'key'
      let field = new Reference({required: true}, {model:model, as:as, type:type, key:key})
      let sequelizeField = field.sequelize()
      expect(typeof sequelizeField.type).to.equal('object')
      expect(sequelizeField.allowNull).to.equal(false)
      expect(sequelizeField.primaryKey).to.equal(false)
      expect(sequelizeField.autoIncrement).to.equal(false)
      expect(sequelizeField.defaultValue).to.equal(undefined)
      expect(typeof sequelizeField.references).to.equal('object')
      expect(sequelizeField.references.model).to.equal(model.name)
      expect(sequelizeField.references.as).to.equal(as)
      expect(sequelizeField.references.key).to.equal(key)
    })
  })

})
