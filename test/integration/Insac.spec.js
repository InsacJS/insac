/* global describe beforeEach after it expect */
const request = require('request')
const path    = require('path')
const util    = require('../../lib/tools/util')

process.env.PROJECT_PATH = path.resolve(__dirname, './academico')
const BASE_URL = 'http://localhost:4004'

describe('\n - Aplicación: Academico\n', () => {
  let service
  beforeEach(() => { clearCacheOfRequire() })
  after(async () => { try { await service.close() } catch (e) { } })
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
    })
    it('Verificando la existencia de los componentes', () => {
      expect(service.app).to.be.an('function')
      expect(service.app).to.have.property('config').to.be.an('object')
      expect(service.app).to.have.property('MODULES').to.be.an('array').to.have.lengthOf(1).to.include('API')
      expect(service.app).to.have.property('APIDOC').to.be.an('object')
      expect(service.app).to.have.property('DB').to.be.an('object')
      expect(service.app).to.have.property('API').to.be.an('object')
    })
    it('Verificando Servicios CRUD', async () => {
      let body = await _request('GET', `/api/v1/libros`)
      expect(body).to.have.property('estado', 'success')

      body = await _request('GET', `/api/v1/libros/1`)
      expect(body).to.have.property('estado', 'success')

      const LIBRO = { titulo: 'La odisea', nro_paginas: 300, precio: 100.90, resumen: 'Historia épica', fid_autor: 1 }
      body = await _request('POST', `/api/v1/libros`, LIBRO)
      expect(body).to.have.property('estado', 'success')
      expect(body.datos).to.have.property('id')
      expect(body.datos).to.have.property('titulo', LIBRO.titulo)
      expect(body.datos).to.have.property('nro_paginas', LIBRO.nro_paginas)
      expect(body.datos).to.have.property('precio', LIBRO.precio)
      expect(body.datos).to.have.property('resumen', LIBRO.resumen)
      expect(body.datos).to.have.property('fid_autor', LIBRO.fid_autor)
      const ID = body.datos.id

      body = await _request('PUT', `/api/v1/libros/${ID}`, { titulo: 'LA ODISEA DE HOMERO' })
      expect(body).to.have.property('estado', 'success')

      body = await _request('DELETE', `/api/v1/libros/${ID}`)
      expect(body).to.have.property('estado', 'success')

      body = await _request('PUT', `/api/v1/libros/${ID}/restore`)
      expect(body).to.have.property('estado', 'success')

      body = await _request('GET', `/api/v1/autores`)
      expect(body).to.have.property('estado', 'success')

      body = await _request('GET', `/api/v1/autores/1`)
      expect(body).to.have.property('estado', 'success')
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

function _request (method, uri, body, headers) {
  const options = { method: method.toUpperCase(), uri: `${BASE_URL}${uri}` }
  if (body)    { options.json   = body }
  if (headers) { options.header = headers }
  return new Promise((resolve, reject) => {
    return request(options, (error, response, body) => {
      if (error) { console.log(error); return reject(error) }
      if (typeof body === 'string') body = JSON.parse(body)
      if (response.statusCode === 500) return reject(body)
      return resolve(body)
    })
  })
}
