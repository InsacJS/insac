'use strict'
const Sequelize = require('sequelize')
const Database = require('../../../lib/core/Database')
const Config = require('../../../lib/core/Config')
const Model = require('../../../lib/core/Model')
const Fields = require('../../../lib/tools/Fields')

describe('\n - Clase: Database\n', () => {

  let config = {
    database: {
      username: TEST_DB_USER,
      password: TEST_DB_PASS,
      name: TEST_DB_NAME
    }
  }

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto sin parámetros', () => {
      let database = new Database()
      expect(database.sequelizeModels.length).to.equal(0)
      expect(typeof database.sequelize).to.equal('object')
      expect(database.sequelize.config.database).to.equal('insac_app')
      expect(database.sequelize.config.username).to.equal('postgres')
      expect(database.sequelize.config.password).to.equal('postgres')
      expect(database.sequelize.options.dialect).to.equal('postgres')
      expect(database.sequelize.options.host).to.equal('localhost')
      expect(database.sequelize.options.port).to.equal(5432)
    })
    it('Instanciando un objeto con parámetros', () => {
      let database = new Database(config)
      expect(database.sequelize.config.database).to.equal(TEST_DB_NAME)
      expect(database.sequelize.config.username).to.equal(TEST_DB_USER)
      expect(database.sequelize.config.password).to.equal(TEST_DB_PASS)
    })
  })

  describe(` Método: addModel`, () => {
    it('Adicionando un modelo a la base de datos', () => {
      let database = new Database(config)
      let persona = database.sequelize.define('persona', { nombre: Sequelize.STRING }, { freezeTableName: true })
      database.addModel(persona)
      expect(Object.keys(database.sequelizeModels).length).to.equal(1)
      expect(typeof database.sequelizeModels.persona).to.equal('function')
    })
  })

  describe(` Método: migrate`, () => {
    it('Verificando la migración de un modelo', (done) => {
      let database = new Database(config)
      let persona = new Model('persona', { fields: { nombre: Fields.STRING() } })
      let models = [persona]
      let define = persona.sequelize()
      let seqModel = database.sequelize.define(define.name, define.attributes, define.options)
      database.addModel(seqModel)
      database.migrate(models).then(() => {
        database.sequelizeModels.persona.findAll().then(result => {
          expect(result.length).to.equal(0)
          done()
        }).catch(err => {
          done(err)
        })
      })
    })
  })

})
