'use strict'
const Field = require('../../../lib/fields/Field')
const Fields = require('../../../lib/tools/Fields')
const Model = require('../../../lib/core/Model')
const Reference = require('../../../lib/fields/Reference')
const STRING = require('../../../lib/datatypes/STRING')

describe('\n - Clase: Reference\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto con parámetros', () => {
      let persona = new Model('persona', {fields:{nombre:Fields.STRING()}})
      let usuario = new Model('usuario', {fields:{username:Fields.STRING()}})
      let type = '1:N'
      let field = new Reference({required: true}, {model:'usuario'}, {type:type})
      field.update(usuario, persona, 'id_usuario')

      expect(field instanceof Field).to.equal(true)
      expect(field.type instanceof STRING).to.equal(true)
      expect(field.description).to.equal('')
      expect(field.required).to.equal(true)
      expect(field.primaryKey).to.equal(false)
      expect(field.autoIncrement).to.equal(false)
      expect(field.defaultValue).to.equal(undefined)

      expect(typeof field.reference).to.equal('object')
      expect(field.reference.model).to.equal('usuario')
      expect(field.reference.as).to.equal('usuario')
      expect(field.reference.key).to.equal('id')
      expect(field.reference.foreignKey).to.equal('id_usuario')

      expect(typeof field.association).to.equal('object')
      expect(field.association.model).to.equal('persona')
      expect(field.association.as).to.equal('personas')
      expect(field.association.type).to.equal('1:N')
      expect(field.association.foreignKey).to.equal('id_usuario')
    })
  })

  describe(` Método: sequelize`, () => {
    it('Verificando el objeto sequelize de un field de tipo referencia', () => {
      let persona = new Model('persona', {fields:{nombre:Fields.STRING()}})
      let usuario = new Model('usuario', {fields:{username:Fields.STRING()}})
      let referenceAs = 'usuario_personalizado', type = '1:N', foreignKey = 'fk'
      let field = new Reference({required: true}, {model:usuario.name, as:referenceAs, foreignKey:foreignKey}, {type:type, foreignKey:foreignKey})
      field.update(usuario, persona, foreignKey)

      expect(typeof field.reference).to.equal('object')
      expect(field.reference.model).to.equal('usuario')
      expect(field.reference.as).to.equal(referenceAs)
      expect(field.reference.key).to.equal('id')
      expect(field.reference.foreignKey).to.equal(foreignKey)

      expect(typeof field.association).to.equal('object')
      expect(field.association.model).to.equal('persona')
      expect(field.association.as).to.equal('personas')
      expect(field.association.type).to.equal(type)
      expect(field.association.foreignKey).to.equal(foreignKey)

      let sequelizeField = field.sequelize()
      expect(typeof sequelizeField.type).to.equal('object')
      expect(sequelizeField.allowNull).to.equal(false)
      expect(sequelizeField.primaryKey).to.equal(false)
      expect(sequelizeField.autoIncrement).to.equal(false)
      expect(sequelizeField.defaultValue).to.equal(undefined)
      expect(typeof sequelizeField.references).to.equal('object')
      expect(sequelizeField.references.model).to.equal(usuario.name)
      expect(sequelizeField.references.as).to.equal(referenceAs)
      expect(sequelizeField.references.key).to.equal('id')
    })
  })

})
