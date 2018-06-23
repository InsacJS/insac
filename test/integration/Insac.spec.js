/* global describe beforeEach it expect */
const path = require('path')
const util = require('../../lib/tools/util')

process.env.PROJECT_PATH = path.resolve(__dirname, './academico')

describe('\n - Aplicación: Academico\n', () => {
  let service
  beforeEach(() => { clearCacheOfRequire() })
  describe(` Acción: crear servicio`, () => {
    it('Verificando la creación del servicio', async () => {
      process.env.LOG   = 'true'
      process.env.SETUP = 'true'
      process.env.START = 'true'
      service = await getService()
      expect(service.app.loaded).to.equal(true)
      expect(true).to.equal(true)
      await service.close()

      process.env.SETUP = 'false'
      await service.init()
      await service.app.API.dao.libro.findOne(null, { id: 1 })
      await service.close()
    })
    it('Verificando la existencia de los componentes', () => {
      expect(service.app).to.be.an('function')
      expect(service.app).to.have.property('config').to.be.an('object')
      expect(service.app).to.have.property('MODULES').to.be.an('array').to.have.lengthOf(1).to.include('API')
      expect(service.app).to.have.property('APIDOC').to.be.an('object')
      expect(service.app).to.have.property('DB').to.be.an('object')
      expect(service.app).to.have.property('API').to.be.an('object')
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
