'use strict'
const Sequelize = require('sequelize')
const Database = require('../../../lib/models/Database')
const Config = require('../../../lib/models/Config')
const Model = require('../../../lib/models/Model')

describe('\n - Clase: Database\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto sin parámetros', () => {
      let database = new Database()
      expect(database.models.length).to.equal(0)
      expect(typeof database.sequelize).to.equal('object')
      expect(database.sequelize.config.database).to.equal('insac_app')
      expect(database.sequelize.config.username).to.equal('postgres')
      expect(database.sequelize.config.password).to.equal('postgres')
      expect(database.sequelize.options.dialect).to.equal('postgres')
      expect(database.sequelize.options.host).to.equal('localhost')
      expect(database.sequelize.options.port).to.equal(5432)
    })
    it('Instanciando un objeto con parámetros', () => {
      let config = {
        username: 'postgres',
        password: 'BK8DJ567F0',
        name: 'insac_test'
      }
      let database = new Database(config)
      expect(database.sequelize.config.database).to.equal('insac_test')
      expect(database.sequelize.config.username).to.equal('postgres')
      expect(database.sequelize.config.password).to.equal('BK8DJ567F0')
    })
  })

  describe(` Método: addModel`, () => {
    it('Adicionando un modelo a la base de datos', () => {
      let config = {
        username: 'postgres',
        password: 'BK8DJ567F0',
        name: 'insac_test'
      }
      let database = new Database(config)
      let persona = database.sequelize.define('persona', { nombre: Sequelize.STRING }, { freezeTableName: true })
      database.addModel(persona)
      expect(Object.keys(database.models).length).to.equal(1)
      expect(typeof database.models.persona).to.equal('function')
    })
  })

  describe(` Método: migrate`, () => {
    it('Verificando la migración de un modelo', (done) => {
      let config = {
        username: 'postgres',
        password: 'BK8DJ567F0',
        name: 'insac_test'
      }
      let database = new Database(config)
      let persona = new Model('persona', { fields: { nombre: { } } })
      let models = [persona]
      let define = persona.sequelize()
      let seqModel = database.sequelize.define(define.name, define.attributes, define.options)
      database.addModel(seqModel)
      database.migrate(models).then(() => {
        database.models.persona.findAll().then(result => {
          expect(result.length).to.equal(0)
          done()
        }).catch(err => {
          done(err)
        })
      })
    })
  })

})
