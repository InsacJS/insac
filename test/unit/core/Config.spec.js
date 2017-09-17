'use strict'
const _ = require('lodash')
const Config = require('../../../lib/core/Config')

describe('\n - Clase: Config\n', () => {

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto sin parámetros', () => {
      let config = new Config()
      let defaultConfig = Config.default(Config.DEFAULT_PROJECT_PATH)
      expect(config.env).to.equal('development')
      expect(_.isEqual(config.projectPath, defaultConfig.projectPath)).to.equal(true)
      expect(_.isEqual(config.path, defaultConfig.path)).to.equal(true)
      expect(_.isEqual(config.server, defaultConfig.server)).to.equal(true)
      expect(_.isEqual(config.database, defaultConfig.database)).to.equal(true)
      expect(_.isEqual(config.auth, defaultConfig.auth)).to.equal(true)
    })
    it('Instancia de un objeto con parámetros 1', () => {
      let env = 'production', projectPath = __dirname
      let config = new Config({env:env, projectPath:projectPath})
      let defaultConfig = Config.default(projectPath)
      expect(config.env).to.equal(env)
      expect(config.projectPath).to.equal(projectPath)
      expect(_.isEqual(config.path, defaultConfig.path)).to.equal(true)
      expect(_.isEqual(config.server, defaultConfig.server)).to.equal(true)
      expect(_.isEqual(config.database, defaultConfig.database)).to.equal(true)
      expect(_.isEqual(config.auth, defaultConfig.auth)).to.equal(true)
    })
    it('Instancia de un objeto con parámetros 2', () => {
      let env = 'development', projectPath = `/custom/path`
      let config = new Config({env:env, projectPath:projectPath, server:{port:7890, all200:true}})
      expect(config.server.port).to.equal(7890)
      expect(config.server.all200).to.equal(true)
      expect(config.path.public).to.equal(`${projectPath}/public`)
      expect(config.path.config).to.equal(`${projectPath}/src/config`)
      expect(config.path.routes).to.equal(`${projectPath}/src/routes`)
      expect(config.path.seeders).to.equal(`${projectPath}/src/seeders`)
    })
    it('Instancia de un objeto con parámetros 3', () => {
      let env = 'development', projectPath = __dirname
      let config = new Config({
        projectPath: projectPath,
        path: {
          public: 'public',
          config: '/absolute/config',
          routes: './routes',
          seeders: './custom/seeders'
        }
      })
      expect(config.path.public).to.equal(`${projectPath}/public`)
      expect(config.path.config).to.equal(`/absolute/config`)
      expect(config.path.routes).to.equal(`${projectPath}/routes`)
      expect(config.path.seeders).to.equal(`${projectPath}/custom/seeders`)
    })
  })

  describe(` Método: update`, () => {
    it('Actualiza la configuración por defecto', () => {
      let config = new Config()
      let custom = {
        path: {
          public: './custom/public'
        },
        server: {
          port: 8000,
          all200: false
        },
        database: {
          name: 'other'
        },
        auth: {
          token: {
            key: 'ULTRA_SECRET',
            expires: 3600
          }
        }
      }
      config.update(custom)
      expect(config.projectPath).to.equal(Config.DEFAULT_PROJECT_PATH)
      expect(config.path.public).to.equal(`${Config.DEFAULT_PROJECT_PATH}/custom/public`)
      expect(config.server.port).to.equal(custom.server.port)
      expect(config.server.all200).to.equal(custom.server.all200)
      expect(config.database.name).to.equal(custom.database.name)
      expect(config.auth.token.key).to.equal(custom.auth.token.key)
      expect(config.auth.token.expires).to.equal(custom.auth.token.expires)
    })
  })

})
