'use strict'
const Field = require('../../../lib/models/Field')
const DataTypes = require('../../../lib/tools/DataTypes')
const Validators = require('../../../lib/tools/Validators')
const Reference = require('../../../lib/models/Reference')
const String = require('../../../lib/datatypes/String')
const Integer = require('../../../lib/datatypes/Integer')

describe('\n - Clase: Field\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto sin parámetros', () => {
      let field = new Field()
      expect(field.name).to.equal('field')
      expect(field.type instanceof String).to.equal(true)
      expect(field.description).to.equal(undefined)
      expect(field.allowNull).to.equal(true)
      expect(field.primaryKey).to.equal(false)
      expect(field.autoIncrement).to.equal(false)
      expect(field.defaultValue).to.equal(undefined)
    })
    it('Instanciando un objeto con parámetros', () => {
      let fieldname = 'id_persona'
      let data = {
        type: DataTypes.INTEGER(),
        validator: Validators.INTEGER(1, 1000),
        description: 'Identificador único de la persona',
        allowNull: false,
        primaryKey: false,
        autoIncrement: false
      }
      let field = new Field(fieldname, data)
      expect(field.name).to.equal(fieldname)
      expect(field.type instanceof Integer).to.equal(true)
      expect(field.description).to.equal(data.description)
      expect(field.allowNull).to.equal(data.allowNull)
      expect(field.primaryKey).to.equal(data.primaryKey)
      expect(field.autoIncrement).to.equal(data.autoIncrement)
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

  describe(` Método (static): ID`, () => {
    it('Verificando la instancia ID', () => {
      let field = Field.ID()
      expect(field instanceof Field).to.equal(true)
      expect(field.name).to.equal('id')
      expect(field.type instanceof Integer).to.equal(true)
      expect(field.description).to.equal('Identificador único')
      expect(field.allowNull).to.equal(false)
      expect(field.primaryKey).to.equal(true)
      expect(field.autoIncrement).to.equal(true)
    })
  })

  describe(` Atributo (static): THIS`, () => {
    it('Verificando valor', () => {
      let field = Field.THIS
      expect(field).to.equal('__this__')
    })
  })

})
