/* global describe it expect */
const express            = require('express')
const bodyParser         = require('body-parser')
const request            = require('request')
const Response           = require('../../../lib/libs/ResponseHandler')
const PreconditionFailed = require('../../../lib/libs/errors/PreconditionFailedError')

const config = require('../../test_config')
const PORT   = config.SERVER.port

describe('\n - Clase: ResponseHandler\n', () => {
  describe(` Método: success`, () => {
    it('Ejecución con parámetros', async () => {
      const app = express()
      app.use(bodyParser.json())
      function successFormat (result) {
        return {
          status  : result.status,
          message : result.message,
          data    : result.data
        }
      }
      app.use(Response.success({ successFormat }))
      app.use(Response.error())
      app.post('/api', (req, res, next) => {
        if (!req.body.titulo) {
          throw new PreconditionFailed()
        }
        res.success200(req.body, 'Libro obtenido exitosamente.')
      })
      app.use((err, req, res, next) => {
        res.error(err)
      })
      const server = app.listen(PORT)
      let options = {
        uri    : `http://localhost:${PORT}/api`,
        method : 'POST',
        json   : { titulo: 'El gato negro', precio: 11.99 }
      }
      let body = await _request(options)
      expect(body).to.have.property('status', 'success')
      expect(body).to.have.property('message', 'Libro obtenido exitosamente.')
      expect(body).to.have.property('data')
      expect(Object.keys(body.data).length).to.equal(2)
      expect(body.data).to.have.property('titulo', options.json.titulo)
      expect(body.data).to.have.property('precio', options.json.precio)

      options.json = { precio: -124 }
      body = await _request(options)
      expect(body).to.have.property('name', 'ResponseHandlerError')
      expect(body).to.have.property('status', PreconditionFailed.STATUS)
      expect(body).to.have.property('type', PreconditionFailed.TYPE)
      expect(body).to.have.property('code', PreconditionFailed.CODE)
      expect(body).to.have.property('message', PreconditionFailed.MESSAGE)
      expect(body).to.have.property('errors')
      expect(body.errors).to.be.an('array')
      expect(body.errors).to.have.lengthOf(1)
      expect(body.errors[0]).to.have.property('dev')
      expect(body.errors[0]).to.have.property('msg')

      await server.close()
    })
  })
})

function _request (options) {
  return new Promise((resolve, reject) => {
    return request(options, (error, response, body) => {
      if (error) { console.log(error); return reject(error) }
      if (typeof body === 'string') body = JSON.parse(body)
      if (response.statusCode === 500) return reject(body)
      return resolve(body)
    })
  })
}
