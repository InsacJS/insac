/* global describe it expect */
const path      = require('path')
const Sequelize = require('sequelize')
const Field     = require('../../../lib/libs/FieldCreator')
const DB_CONFIG = require('../../test.config').DATABASE.postgres

describe('\n - Clase: Field\n', () => {
  describe(` Método: STRING`, () => {
    it('Ejecución sin parámetros', () => {
      const FIELD = Field.STRING()
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'STRING')
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('len')
    })
    it('Ejecución con 1 parámetro de tipo entero', () => {
      const length = 10
      const FIELD = Field.STRING(length)
      expect(FIELD.type).to.have.property('_length', length)
      expect(FIELD.validate.len.args[1]).to.equal(length)
    })
    it('Ejecución con 1 parámetro de tipo objeto', () => {
      const params = { comment: 'String field', validate: null }
      const FIELD = Field.STRING(params)
      expect(FIELD).to.have.property('comment', params.comment)
      expect(FIELD.validate).to.equal(null)
    })
    it('Ejecución con 2 parámetros', () => {
      const length = 10
      const params = { comment: 'String field', validate: null }
      const FIELD = Field.STRING(length, params)
      expect(FIELD.type).to.have.property('_length', length)
      expect(FIELD).to.have.property('comment', params.comment)
      expect(FIELD.validate).to.equal(null)
    })
  })

  describe(` Método: INTEGER`, () => {
    it('Ejecución sin parámetros', () => {
      const FIELD = Field.INTEGER()
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'INTEGER')
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('isInt')
      expect(FIELD.validate).to.have.property('min')
      expect(FIELD.validate).to.have.property('max')
    })
  })

  describe(` Método: FLOAT`, () => {
    it('Ejecución sin parámetros', () => {
      const FIELD = Field.FLOAT()
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'FLOAT')
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('isFloat')
      expect(FIELD.validate).to.have.property('min')
      expect(FIELD.validate).to.have.property('max')
    })
  })

  describe(` Método: ENUM`, () => {
    it('Ejecución con parámetros', () => {
      const values = ['A', 'B']
      const FIELD = Field.ENUM(values)
      expect(FIELD).to.have.property('type')
      expect(FIELD.type).to.have.property('key', 'ENUM')
      expect(FIELD).to.have.property('validate')
      expect(FIELD.validate).to.have.property('isIn')
    })
  })

  describe(` Método: clone`, () => {
    it('Ejecución sin parámetros', () => {
      const STR = Field.STRING()
      expect(STR).to.not.have.property('allowNull')
      const CLONE = Field.clone(STR, { allowNull: false })
      expect(CLONE.type.key).to.equal('STRING')
      expect(CLONE).to.have.property('allowNull', false)
    })
    it('Ejecución con parámetros', () => {
      const STR = Field.STRING({ allowNull: false })
      expect(STR).to.have.property('allowNull', false)
      const CLONE = Field.clone(STR, { allowNull: true, comment: 'Comment' })
      expect(CLONE.type.key).to.equal('STRING')
      expect(CLONE).to.have.property('allowNull', true)
      expect(CLONE).to.have.property('comment', 'Comment')
    })
  })

  describe(` Método: use`, () => {
    it('Ejecución sin parámetros', () => {
      const STR = Field.STRING()
      expect(STR).to.not.have.property('allowNull')
      Field.use('ONE', STR)
      const ONE = Field.ONE({ allowNull: false })
      expect(ONE.type.key).to.equal('STRING')
      expect(ONE).to.have.property('allowNull', false)
    })
    it('Ejecución con parámetros', () => {
      const STR = Field.STRING({ allowNull: false })
      expect(STR).to.have.property('allowNull', false)
      Field.use('TWO', STR)
      const TWO = Field.TWO({ allowNull: true, comment: 'Comment' })
      expect(TWO.type.key).to.equal('STRING')
      expect(TWO).to.have.property('allowNull', true)
      expect(TWO).to.have.property('comment', 'Comment')
    })
    it('Sobreescribiendo tipos de datos', () => {
      Field.use('A', Field.STRING({ comment: 'A1' }))
      expect(Field.A().type.key).to.equal('STRING')
      expect(Field.A().comment).to.equal('A1')
      Field.use('A', Field.STRING({ comment: 'A2' }))
      expect(Field.A().type.key).to.equal('STRING')
      expect(Field.A().comment).to.equal('A2')
      Field.use('A', Field.INTEGER({ comment: 'A3' }))
      expect(Field.A().type.key).to.equal('INTEGER')
      expect(Field.A().comment).to.equal('A3')
    })
  })

  describe(` Método: group`, () => {
    it('Ejecución con parámetros', () => {
      const sequelize = new Sequelize(DB_CONFIG.database, DB_CONFIG.username, DB_CONFIG.password, DB_CONFIG.params)
      const pathModels = path.resolve(__dirname, './models')
      Field.use('ID', Field.INTEGER({
        primaryKey    : true,
        autoIncrement : true,
        validate      : { min: 1 }
      }))
      sequelize.import(`${pathModels}/autor.model.js`)
      sequelize.import(`${pathModels}/libro.model.js`)
      sequelize.models.autor.associate(sequelize.models)
      sequelize.models.libro.associate(sequelize.models)
      const THIS = Field.THIS
      const RESULT1 = Field.group(sequelize.models.libro, {
        id_libro : THIS(),
        titulo   : THIS(),
        precio   : THIS()
      })
      const RESULT2 = Field.group(sequelize.models.libro, {
        titulo : THIS({ allowNull: false }),
        precio : THIS({ allowNull: true })
      })
      expect(sequelize.models.libro.attributes.titulo).to.not.have.property('allowNull')
      expect(sequelize.models.libro.attributes.precio).to.not.have.property('allowNull')
      expect(RESULT1.titulo).to.not.have.property('allowNull')
      expect(RESULT1.precio).to.not.have.property('allowNull')
      expect(RESULT2.titulo).to.have.property('allowNull', false)
      expect(RESULT2.precio).to.have.property('allowNull', true)
    })
  })
})
