'use strict'
const Reference = require('../../../lib/models/Reference')
const STRING = require('../../../lib/datatypes/STRING')
const STRING_VALIDATOR = require('../../../lib/validators/STRING_VALIDATOR')
const INTEGER = require('../../../lib/datatypes/INTEGER')
const Field = require('../../../lib/models/Field')
const Model = require('../../../lib/models/Model')

describe('\n - Clase: Reference\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto con parámetros', () => {
      let model = 'usuario', as = 'usuarios', type = '1:N'
      let field = new Reference('id_usuario', {allowNull: false}, {model, undefined, type})
      expect(field instanceof Field).to.equal(true)
      expect(field.name).to.equal('id_usuario')
      expect(field.type instanceof STRING).to.equal(true)
      expect(field.description).to.equal(undefined)
      expect(field.allowNull).to.equal(false)
      expect(field.primaryKey).to.equal(false)
      expect(field.autoIncrement).to.equal(false)
      expect(field.defaultValue).to.equal(undefined)
      expect(typeof field.reference).to.equal('object')
      expect(field.reference.model).to.equal(model)
      expect(field.reference.as).to.equal(as)
      expect(field.reference.type).to.equal(type)
      expect(field.reference.key).to.equal('id')
    })
  })

  describe(` Método: sequelize`, () => {
    it('Verificando el objeto sequelize de un field de tipo referencia', () => {
      let model = 'usuario', as = 'usuarios', type = '1:N', key = 'key'
      let field = new Reference('id_usuario', {allowNull: false}, {model, undefined, type, key})
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

  describe(` Método (static): ONE_TO_ONE`, () => {
    it('Verificando la instancia ONE_TO_ONE', () => {
      let usuario = new Model('usuario', {
        fields: {
          username: {
            description: 'Nombre de usuario'
          }
        }
      })
      let field = Reference.ONE_TO_ONE(usuario, {allowNull:false, key:'username'})
      expect(field instanceof Field).to.equal(true)
      expect(field.name).to.equal('id_field')
      expect(field.type instanceof STRING).to.equal(true)
      expect(field.validator instanceof STRING_VALIDATOR).to.equal(true)
      expect(field.description).to.equal(`Nombre de usuario del registro 'usuario'`)
      expect(field.allowNull).to.equal(false)
      expect(field.primaryKey).to.equal(false)
      expect(field.autoIncrement).to.equal(false)
      expect(typeof field.reference).to.equal('object')
      expect(field.reference.model).to.equal('usuario')
      expect(field.reference.as).to.equal('usuario')
      expect(field.reference.type).to.equal('1:1')
      expect(field.reference.key).to.equal('username')
    })
  })

  describe(` Método (static): ONE_TO_MANY`, () => {
    it('Verificando la instancia ONE_TO_MANY', () => {
      let usuario = new Model('usuario', {
        fields: {
          username: {
            description: 'Nombre de usuario'
          }
        }
      })
      let field = Reference.ONE_TO_MANY(usuario, {allowNull:false, key:'username'})
      expect(field instanceof Field).to.equal(true)
      expect(field.name).to.equal('id_field')
      expect(field.type instanceof STRING).to.equal(true)
      expect(field.validator instanceof STRING_VALIDATOR).to.equal(true)
      expect(field.description).to.equal(`Nombre de usuario del registro 'usuario'`)
      expect(field.allowNull).to.equal(false)
      expect(field.primaryKey).to.equal(false)
      expect(field.autoIncrement).to.equal(false)
      expect(typeof field.reference).to.equal('object')
      expect(field.reference.model).to.equal('usuario')
      expect(field.reference.as).to.equal('usuarios')
      expect(field.reference.type).to.equal('1:N')
      expect(field.reference.key).to.equal('username')
    })
  })

})
