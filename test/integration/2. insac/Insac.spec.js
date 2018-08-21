/* global describe before after it expect */
const request = require('request')
const _       = require('lodash')
const path    = require('path')

let util = require('../../../lib/tools/util')

let config
let service

describe('\n - Aplicación: Academico\n', () => {
  before(async () => {
    service = await getService()
  })
  after(async () => {
    try { await service.close() } catch (e) { }
  })
  describe(` Acción: crear servicio`, () => {
    it('Verificando la creación del servicio', async () => {
      expect(service.app.loaded).to.equal(true)
      await service.app.API.dao.libro.findOne(null, { id: 1 })
    })
    it('Verificando la existencia de los componentes', async () => {
      expect(service.app).to.be.an('function')
      expect(service.app).to.have.property('config').to.be.an('object')
      expect(service.app).to.have.property('logger').to.be.an('object')
      expect(service.app).to.have.property('modules').to.be.an('array').to.have.lengthOf(1).to.include('API')
      expect(service.app).to.have.property('apidoc').to.be.an('object')
      expect(service.app).to.have.property('DB').to.be.an('object')
      expect(service.app).to.have.property('API').to.be.an('object')
      expect(service.app).to.have.property('SERVER').to.be.an('object')
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

      body = await _request('GET', `/api/v1/libros/${ID}`)
      expect(body).to.have.property('estado', 'success')

      body = await _request('PUT', `/api/v1/libros/${ID}`, { titulo: 'LA ODISEA DE HOMERO' })
      expect(body).to.have.property('mensaje')
      expect(body).to.have.property('estado', 'success')

      body = await _request('DELETE', `/api/v1/libros/${ID}`)
      expect(body).to.have.property('mensaje')
      expect(body).to.have.property('estado', 'success')

      body = await _request('GET', `/api/v1/libros/${ID}`)
      expect(body).to.have.property('estado', 'error')

      body = await _request('PUT', `/api/v1/libros/${ID}/restore`)
      expect(body).to.have.property('mensaje')
      expect(body).to.have.property('estado', 'success')

      body = await _request('GET', `/api/v1/libros/${ID}`)
      expect(body).to.have.property('estado', 'success')

      body = await _request('GET', `/api/v1/autores`)
      expect(body).to.have.property('mensaje')
      expect(body).to.have.property('estado', 'success')
      expect(body).to.have.property('metadatos')
      expect(body.metadatos).to.have.property('count', 3)
      expect(body.metadatos).to.have.property('limit', 50)
      expect(body.metadatos).to.have.property('page', 1)
      expect(body.metadatos).to.have.property('start', 1)
      expect(body.metadatos).to.have.property('end', 3)
      expect(body).to.have.property('datos')
      expect(Array.isArray(body.datos)).to.equal(true)
      expect(body.datos.length).to.equal(3)
      for (let i in body.datos) {
        expect(body.datos[i]).to.have.property('id')
        expect(body.datos[i]).to.have.property('nombre')
        expect(body.datos[i]).to.have.property('direccion')
        expect(body.datos[i]).to.have.property('telefono')
        expect(body.datos[i]).to.have.property('tipo')
        expect(body.datos[i]).to.have.property('activo')
      }
      body = await _request('GET', `/api/v1/autores/1`)
      expect(body).to.have.property('mensaje')
      expect(body).to.have.property('estado', 'success')
      expect(body).to.have.property('datos')
      expect(body.datos).to.have.property('id')
      expect(body.datos).to.have.property('nombre')
      expect(body.datos).to.have.property('direccion')
      expect(body.datos).to.have.property('telefono')
      expect(body.datos).to.have.property('tipo')
      expect(body.datos).to.have.property('activo')
    })

    it('Verificando Servicios con filtros', async () => {
      let body = await _request('GET', `/api/v1/autores?fields=id,nombre`)
      expect(body).to.have.property('mensaje')
      expect(body).to.have.property('estado', 'success')
      expect(body).to.have.property('metadatos')
      expect(body.metadatos).to.have.property('count', 3)
      expect(body.metadatos).to.have.property('limit', 50)
      expect(body.metadatos).to.have.property('page', 1)
      expect(body.metadatos).to.have.property('start', 1)
      expect(body.metadatos).to.have.property('end', 3)
      expect(body).to.have.property('datos')
      expect(Array.isArray(body.datos)).to.equal(true)
      expect(body.datos.length).to.equal(3)
      for (let i in body.datos) {
        expect(body.datos[i]).to.have.property('id')
        expect(body.datos[i]).to.have.property('nombre')
        expect(body.datos[i]).to.not.have.property('direccion')
        expect(body.datos[i]).to.not.have.property('telefono')
        expect(body.datos[i]).to.not.have.property('tipo')
        expect(body.datos[i]).to.not.have.property('activo')
        expect(body.datos[i]).to.not.have.property('libros')
      }
      body = await _request('GET', `/api/v1/autores/1?fields=id,libros(id,titulo)`)
      expect(body).to.have.property('mensaje')
      expect(body).to.have.property('estado', 'success')
      expect(body).to.have.property('datos')
      expect(body.datos).to.have.property('id')
      expect(body.datos).to.not.have.property('nombre')
      expect(body.datos).to.not.have.property('direccion')
      expect(body.datos).to.not.have.property('telefono')
      expect(body.datos).to.not.have.property('tipo')
      expect(body.datos).to.not.have.property('activo')
      expect(body.datos).to.have.property('libros')
      for (let i in body.datos.libros) {
        expect(body.datos.libros[i]).to.have.property('id')
        expect(body.datos.libros[i]).to.have.property('titulo')
        expect(body.datos.libros[i]).to.not.have.property('nro_paginas')
        expect(body.datos.libros[i]).to.not.have.property('precio')
        expect(body.datos.libros[i]).to.not.have.property('resumen')
      }
    })
  })
})

function clearCacheOfRequire () {
  for (let i in require.cache) {
    delete require.cache[require.resolve(i)]
  }
}

function clearEnv () {
  delete process.env.PROJECT_PATH
  delete process.env.PROTOCOL
  delete process.env.HOSTNAME
  delete process.env.PORT
  delete process.env.NODE_ENV
  delete process.env.SQL_LOG
  delete process.env.DB_USER
  delete process.env.DB_PASS
  delete process.env.DB_NAME
  delete process.env.DB_HOST
  delete process.env.DB_PORT
  delete process.env.DB_TZ
  delete process.env.DIALECT
  delete process.env.APIDOC
  delete process.env.LOGGER
  delete process.env.SETUP
  delete process.env.START
}

function getService () {
  return new Promise((resolve, reject) => {
    clearCacheOfRequire()
    clearEnv()
    process.env.PROJECT_PATH = path.resolve(__dirname, './academico')
    process.env.LOGGER       = 'true'
    process.env.SETUP        = 'true'
    process.env.START        = 'true'
    config   = _.cloneDeep(require('../../test_config'))
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

function _request (method, uri, body, headers) {
  const BASE_URL = `http://localhost:${config.SERVER.port}`
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
