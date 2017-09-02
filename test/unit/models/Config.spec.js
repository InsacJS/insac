'use strict'
const _ = require('lodash')
const path = require('path')
const Config = require('../../../lib/models/Config')
const Util = require('../../../lib/tools/Util')

describe('\n - Clase: Config\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto sin parámetros', () => {
      let config = new Config()
      let defaultProjectPath = Config.defaultProjectPath()
      let defaultPath = Config.defaultPath(defaultProjectPath)
      let defaultServer = Config.defaultServer()
      let defaultDatabase = Config.defaultDatabase()
      let defaultAuth = Config.defaultAuth()
      expect(config.env).to.equal('development')
      expect(_.isEqual(config.projectPath, defaultProjectPath)).to.equal(true)
      expect(_.isEqual(config.path, defaultPath)).to.equal(true)
      expect(_.isEqual(config.server, defaultServer)).to.equal(true)
      expect(_.isEqual(config.database, defaultDatabase)).to.equal(true)
      expect(_.isEqual(config.auth, defaultAuth)).to.equal(true)
    })
    it('Instancia de un objeto con parámetros 1', () => {
      let env = 'production', projectPath = __dirname
      let config = new Config({env:env, projectPath:projectPath})
      expect(config.env).to.equal(env)
      expect(config.projectPath).to.equal(projectPath)
    })
    it('Instancia de un objeto con parámetros 2', () => {
      let env = 'development', projectPath = `${__dirname}/Config`
      let config = new Config({env:env, projectPath:projectPath})
      expect(config.server.port).to.equal(7890)
      expect(config.one).to.equal('ONE')
      expect(config.two.prop).to.equal('TWO')
      expect(config.path.public).to.equal(`${projectPath}/customPublic`)
      expect(config.path.config).to.equal(`${projectPath}/config`)
      expect(config.path.routes).to.equal(`${projectPath}/routes`)
      expect(config.path.seeders).to.equal(`/home/seeders`)
    })
  })

})
