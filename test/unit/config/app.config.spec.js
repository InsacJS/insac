/* global describe beforeEach it expect */
const path = require('path')

const APP_CONFIG_PATH = path.resolve(global.INSAC, 'lib/config/app.config')

describe('\n - Archivo: app.config.js\n', () => {
  beforeEach(() => { clearCacheOfRequire() })
  describe(` Propiedad: SERVER`, () => {
    it('Verificando valores por defecto', () => {
      process.env.PROJECT_PATH = path.resolve(__dirname, 'empty')
      delete process.env.PORT
      delete process.env.NODE_ENV
      clearCacheOfRequire()
      const config = require(APP_CONFIG_PATH)
      expect(config).to.have.property('SERVER').to.be.an('object')
      expect(config.SERVER).to.have.property('port', 4000)
      expect(config.SERVER).to.have.property('env', 'development')
      expect(config.SERVER).to.have.property('cors')
      expect(config.SERVER).to.have.property('options')
      expect(config.SERVER).to.have.property('https', false)
    })

    it('Verificando valores personalizados desde las variables de entorno', () => {
      process.env.PROJECT_PATH = __dirname
      process.env.PORT         = 5000
      process.env.NODE_ENV     = 'production'
      const config = require(APP_CONFIG_PATH)
      expect(config).to.have.property('SERVER').to.be.an('object')
      expect(config.SERVER).to.have.property('port', 5000)
      expect(config.SERVER).to.have.property('env', 'production')
      expect(config.SERVER).to.have.property('cors')
      expect(config.SERVER).to.have.property('options')
      expect(config.SERVER).to.have.property('https', false)
    })

    it('Verificando valores personalizados desde el archivo de configuración', () => {
      process.env.PROJECT_PATH = __dirname
      delete process.env.PORT
      delete process.env.NODE_ENV
      const config = require(APP_CONFIG_PATH)
      expect(config).to.have.property('SERVER').to.be.an('object')
      expect(config.SERVER).to.have.property('port', 6000)
      expect(config.SERVER).to.have.property('env', 'test')
      expect(config.SERVER).to.have.property('cors')
      expect(config.SERVER).to.have.property('options')
      expect(config.SERVER).to.have.property('https', false)
    })
  })

  describe(` Propiedad: DATABASE`, () => {
    it('Verificando valores por defecto', () => {
      process.env.PROJECT_PATH = path.resolve(__dirname, 'empty')
      delete process.env.DB_USER
      delete process.env.DB_PASS
      delete process.env.DB_NAME
      delete process.env.DB_HOST_NAME
      delete process.env.DB_HOST_PORT
      const config = require(APP_CONFIG_PATH)
      expect(config).to.have.property('DATABASE').to.be.an('object')
      expect(config.DATABASE).to.have.property('username', 'postgres')
      expect(config.DATABASE).to.have.property('password', 'postgres')
      expect(config.DATABASE).to.have.property('database', '_example')
      expect(config.DATABASE).to.have.property('params')
      expect(config.DATABASE.params).to.have.property('dialect', 'postgres')
      expect(config.DATABASE.params).to.have.property('storage', '_example.sqlite')
      expect(config.DATABASE.params).to.have.property('host', '127.0.0.1')
      expect(config.DATABASE.params).to.have.property('port', 5432)
      expect(config.DATABASE.params).to.have.property('timezone', '+00:00')
      expect(config.DATABASE.params).to.have.property('lang', 'es')
      expect(config.DATABASE.params).to.have.property('operatorsAliases', false)
      expect(config.DATABASE.params).to.have.property('define')
      expect(config.DATABASE.params.define).to.have.property('underscored', true)
      expect(config.DATABASE.params.define).to.have.property('freezeTableName', true)
      expect(config.DATABASE.params.define).to.have.property('timestamps', true)
      expect(config.DATABASE.params.define).to.have.property('paranoid', true)
      expect(config.DATABASE.params.define).to.have.property('createdAt', '_fecha_creacion')
      expect(config.DATABASE.params.define).to.have.property('updatedAt', '_fecha_modificacion')
      expect(config.DATABASE.params.define).to.have.property('deletedAt', '_fecha_eliminacion')
    })
    it('Verificando valores personalizados desde las variables de entorno', () => {
      process.env.PROJECT_PATH = __dirname
      process.env.DB_USER      = 'root'
      process.env.DB_PASS      = '123'
      process.env.DB_NAME      = '_test'
      process.env.DB_HOST_NAME = '127.0.0.2'
      process.env.DB_HOST_PORT = '1234'
      const config = require(APP_CONFIG_PATH)
      expect(config).to.have.property('DATABASE').to.be.an('object')
      expect(config.DATABASE).to.have.property('username', 'root')
      expect(config.DATABASE).to.have.property('password', '123')
      expect(config.DATABASE).to.have.property('database', '_test')
      expect(config.DATABASE).to.have.property('params')
      expect(config.DATABASE.params).to.have.property('host', '127.0.0.2')
      expect(config.DATABASE.params).to.have.property('port', 1234)
    })
    it('Verificando valores personalizados desde el archivo de configuración', () => {
      process.env.PROJECT_PATH = __dirname
      delete process.env.DB_USER
      delete process.env.DB_PASS
      delete process.env.DB_NAME
      delete process.env.DB_HOST_NAME
      delete process.env.DB_HOST_PORT
      const config = require(APP_CONFIG_PATH)
      expect(config).to.have.property('DATABASE').to.be.an('object')
      expect(config.DATABASE).to.have.property('username', '_custom')
      expect(config.DATABASE).to.have.property('password', '_custom')
      expect(config.DATABASE).to.have.property('database', '_custom')
      expect(config.DATABASE).to.have.property('params')
      expect(config.DATABASE.params).to.have.property('dialect', 'mysql')
      expect(config.DATABASE.params).to.have.property('storage', '_example.sqlite')
      expect(config.DATABASE.params).to.have.property('host', '127.0.0.3')
      expect(config.DATABASE.params).to.have.property('port', 3306)
      expect(config.DATABASE.params).to.have.property('timezone', '-04:00')
      expect(config.DATABASE.params).to.have.property('lang', 'es')
      expect(config.DATABASE.params).to.have.property('operatorsAliases', true)
      expect(config.DATABASE.params).to.have.property('define')
      expect(config.DATABASE.params.define).to.have.property('underscored', false)
      expect(config.DATABASE.params.define).to.have.property('freezeTableName', false)
      expect(config.DATABASE.params.define).to.have.property('timestamps', false)
      expect(config.DATABASE.params.define).to.have.property('paranoid', false)
      expect(config.DATABASE.params.define).to.have.property('createdAt', '_fecha_creacion_custom')
      expect(config.DATABASE.params.define).to.have.property('updatedAt', '_fecha_modificacion_custom')
      expect(config.DATABASE.params.define).to.have.property('deletedAt', '_fecha_eliminacion_custom')
    })
  })
})

function clearCacheOfRequire () {
  for (let i in require.cache) {
    delete require.cache[require.resolve(i)]
  }
}
