'use strict'
const Model = require('../../../lib/models/Model')
const Field = require('../../../lib/models/Field')
const DataTypes = require('../../../lib/tools/DataTypes')
const Validators = require('../../../lib/tools/Validators')

describe('\n - Clase: Model\n', () => {

  describe(` Método: constructor`, () => {
    it('instanciando un objeto sin parámetros', () => {
      let model = new Model('usuario')
      expect(Object.keys(model.fields).length).to.equal(1)
      expect(model.fields.id instanceof Field).to.equal(true)
      expect(typeof model.options).to.equal('object')
      expect(model.options.singular).to.equal('usuario')
      expect(model.options.plural).to.equal('usuarios')
      expect(model.options.uniqueKeys.length).to.equal(0)
      expect(model.options.timestamps).to.equal(false)
      expect(model.options.createdAt).to.equal('_fecha_creacion')
      expect(model.options.updatedAt).to.equal('_fecha_modificacion')
      expect(model.options.associations.length).to.equal(0)
    })

    it('Instanciando un objeto con parámetros', () => {
      let data = {
        fields: {
          name: { type: DataTypes.STRING(100) },
          year: { type: DataTypes.INTEGER() }
        },
        options: {
          plural: 'autores',
          uniqueKeys: ['name'],
          timestamps: true,
          createdAt: 'fecha_de_creacion',
          updatedAt: 'fecha_de_modificacion'
        }
      }
      let model = new Model('autor', data)
      expect(Object.keys(model.fields).length).to.equal(3)
      expect(model.fields.id instanceof Field).to.equal(true)
      expect(model.fields.name instanceof Field).to.equal(true)
      expect(model.fields.year instanceof Field).to.equal(true)
      expect(typeof model.options).to.equal('object')
      expect(model.options.singular).to.equal('autor')
      expect(model.options.plural).to.equal('autores')
      expect(model.options.uniqueKeys.length).to.equal(data.options.uniqueKeys.length)
      expect(model.options.uniqueKeys[0]).to.equal(data.options.uniqueKeys[0])
      expect(model.options.timestamps).to.equal(true)
      expect(model.options.createdAt).to.equal(data.options.createdAt)
      expect(model.options.updatedAt).to.equal(data.options.updatedAt)
      expect(model.options.associations.length).to.equal(0)
    })
  })

  describe(` Método: sequelize`, () => {
    it('Verificando el objeto sequelize de un modelo', () => {
      let data = {
        fields: {
          name: { type: DataTypes.STRING(100) },
          year: { type: DataTypes.INTEGER() }
        },
        options: {
          plural: 'autores',
          uniqueKeys: ['name'],
          timestamps: true,
          createdAt: 'fecha_de_creacion',
          updatedAt: 'fecha_de_modificacion'
        }
      }
      let model = new Model('autor', data)
      let define = model.sequelize()
      expect(define.name).to.equal('autor')
      expect(typeof define.attributes).to.equal('object')
      expect(Object.keys(define.attributes).length).to.equal(3)
      expect(typeof define.options).to.equal('object')
      expect(define.options.singular).to.equal('autor')
      expect(define.options.plural).to.equal('autores')
      expect(define.options.timestamps).to.equal(true)
      expect(define.options.uniqueKeys.length).to.equal(1)
      expect(define.options.uniqueKeys[0].fields.length).to.equal(1)
      expect(define.options.uniqueKeys[0].fields[0]).to.equal('name')
      expect(define.options.createdAt).to.equal('fecha_de_creacion')
      expect(define.options.updatedAt).to.equal('fecha_de_modificacion')
      expect(define.options.freezeTableName).to.equal(true)
    })
  })

})
