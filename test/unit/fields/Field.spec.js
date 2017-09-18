'use strict'
const Field = require('../../../lib/fields/Field')
const DataTypes = require('../../../lib/tools/DataTypes')
const Validators = require('../../../lib/tools/Validators')
const Reference = require('../../../lib/fields/Reference')
const STRING = require('../../../lib/datatypes/STRING')
const INTEGER = require('../../../lib/datatypes/INTEGER')

describe('\n - Clase: Field\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto sin parámetros', () => {
      let field = new Field()
      expect(field.type instanceof STRING).to.equal(true)
      expect(field.description).to.equal('')
      expect(field.required).to.equal(false)
      expect(field.primaryKey).to.equal(false)
      expect(field.autoIncrement).to.equal(false)
      expect(field.defaultValue).to.equal(undefined)
    })
    it('Instanciando un objeto con parámetros', () => {
      let data = {
        type: DataTypes.INTEGER(),
        validator: Validators.INTEGER(1, 1000),
        description: 'Identificador único de la persona',
        required: true,
        primaryKey: false,
        autoIncrement: false
      }
      let field = new Field(data)
      expect(field.type instanceof INTEGER).to.equal(true)
      expect(field.description).to.equal(data.description)
      expect(field.required).to.equal(data.required)
      expect(field.primaryKey).to.equal(data.primaryKey)
      expect(field.autoIncrement).to.equal(data.autoIncrement)
    })
  })

  describe(` Método: update`, () => {
    it('Actualiza los valores de un field', () => {
      let field = new Field()
      let properties = {
        type: DataTypes.INTEGER(),
        description: 'custom',
        required: true,
        defaultValue: 100,
        validator: null
      }
      field.update(properties)
      expect(field.type instanceof INTEGER).to.equal(true)
      expect(field.required).to.equal(true)
      expect(field.description).to.equal('custom')
      expect(field.defaultValue).to.equal(100)
      expect(field.validator).to.equal(null)
    })
  })

  describe(` Método: validate`, () => {
    it('Verificando resultado con datos válidos', () => {
      let field = new Field()
      let resultA = field.validate('texto')
      expect(resultA).to.have.property('isValid', true)
      expect(resultA).to.have.property('value', 'texto')
      expect(resultA).to.have.property('message', 'El campo es válido')
    })
    it('Verificando resultado con datos inválidos 1ra forma', () => {
      let field = new Field({
        type: DataTypes.STRING(),
        validator: Validators.STRING(1, 10)
      })
      expect(field.validate('texto')).to.have.property('isValid', true)
      expect(field.validate(100)).to.have.property('isValid', false)
    })
    it('Verificando resultado con datos inválidos 2da forma', () => {
      let field = new Field({
        type: DataTypes.INTEGER(),
        validator: Validators.INTEGER(1, 10)
      })
      expect(field.validate('texto')).to.have.property('isValid', false)
      expect(field.validate(0)).to.have.property('isValid', false)
      expect(field.validate(100)).to.have.property('isValid', false)
      expect(field.validate(1)).to.have.property('isValid', true)
      expect(field.validate(10)).to.have.property('isValid', true)
    })
    it('Verificando resultado sin un validador', () => {
      let field = new Field({validator: null})
      expect(field.validate('texto')).to.have.property('isValid', true)
      expect(field.validate(false)).to.have.property('isValid', true)
      expect(field.validate(null)).to.have.property('isValid', true)
      expect(field.validate(undefined)).to.have.property('isValid', true)
      expect(field.validate(10)).to.have.property('isValid', true)
    })
  })

  describe(` Método: sequelize`, () => {
    it('Verificando el objeto sequelize de un field', () => {
      let field = new Field()
      let sequelizeField = field.sequelize()
      expect(typeof sequelizeField.type).to.equal('object')
      expect(sequelizeField.allowNull).to.equal(true)
      expect(sequelizeField.primaryKey).to.equal(false)
      expect(sequelizeField.autoIncrement).to.equal(false)
      expect(sequelizeField.defaultValue).to.equal(undefined)
    })
  })

})
