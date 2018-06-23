/* global describe beforeEach it expect */
const path = require('path')
const util = require('../../lib/tools/util')

process.env.PROJECT_PATH = path.resolve(__dirname, './academico')

describe('\n - Aplicación: Academico\n', () => {
  let service
  beforeEach(() => { clearCacheOfRequire() })
  describe(` Acción: crear servicio`, () => {
    it('Verificando la creación del servicio', async () => {
      service = await getService()
      expect(service.app.loaded).to.equal(true)
      expect(true).to.equal(true)
    })
    it('Verificando la existencia de los componentes', () => {
      expect(service.app).to.be.an('function')
      expect(service.app).to.have.property('API').to.be.an('object')
      expect(service.app).to.have.property('MODULES').to.be.an('array').to.have.lengthOf(1).to.include('API')
      expect(service.app).to.have.property('DB').to.be.an('object')
      expect(service.app).to.have.property('APIDOC').to.be.an('object')
      expect(service.app).to.have.property('config').to.be.an('object')
    })
    it('Verificando la configuración del servicio', () => {
      expect(service.app).to.have.property('config')
      expect(service.app.config).to.have.property('SERVER')
      expect(service.app.config).to.have.property('DATABASE')
      expect(service.app.config).to.have.property('API')
    })
  })
})

function getService () {
  return new Promise((resolve, reject) => {
    const service = require(process.env.PROJECT_PATH)
    const retry = async (cnt) => {
      if (!service.app.loaded) {
        if (cnt > 10) { return reject(new Error('Hubo un error al cargar la aplicación.')) }
        await util.timer(500)
        return retry(cnt++)
      }
      return resolve(service)
    }
    return retry(1)
  })
}

function clearCacheOfRequire () {
  for (let i in require.cache) {
    delete require.cache[require.resolve(i)]
  }
}
