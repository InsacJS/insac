'use strict'
const _ = require('lodash')
const Server = require('../../../lib/models/Server')
const Config = require('../../../lib/models/Config')
const request = require('request')

describe('\n - Clase: Server\n', () => {

  let server1, server2

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto sin parámetros', () => {
      server1 = new Server()
      expect(typeof server1.express).to.not.equal('undefined')
      expect(typeof server1.express.response._success200).to.equal('function')
      expect(typeof server1.express.response._success201).to.equal('function')
      expect(typeof server1.express.response.error401).to.equal('function')
      expect(typeof server1.express.response.error403).to.equal('function')
      expect(typeof server1.express.response.error404).to.equal('function')
      expect(typeof server1.express.response.error422).to.equal('function')
      expect(typeof server1.express.response.error500).to.equal('function')
      expect(typeof server1.express.response.error).to.equal('function')
      expect(server1.express.response._config_.all200).to.equal(false)
    })
    it('Instanciando un objeto con parámetros', () => {
      server2 = new Server({all200:true})
      expect(typeof server2.express).to.not.equal('undefined')
      expect(typeof server2.express.response._success200).to.equal('function')
      expect(typeof server2.express.response._success201).to.equal('function')
      expect(typeof server2.express.response.error401).to.equal('function')
      expect(typeof server2.express.response.error403).to.equal('function')
      expect(typeof server2.express.response.error404).to.equal('function')
      expect(typeof server2.express.response.error422).to.equal('function')
      expect(typeof server2.express.response.error500).to.equal('function')
      expect(typeof server2.express.response.error).to.equal('function')
      expect(server2.express.response._config_.all200).to.equal(true)
    })
  })

  describe(` Método: addMiddleware`, () => {
    it('Adicionando un middleware', () => {
      server1.addMiddleware('/', (req, res, next) => {
        req.user = 'JHON SMITH'
        next()
      })
    })
  })

  describe(` Método: addRoute`, () => {
    it('Adicionando una ruta', () => {
      server1.addRoute('GET', '/home', (req, res, next) => {
        res._success200(`Bienvenido al mundo real ${req.user}`)
      })
      server1.addRoute('GET', '/error', (req, res, next) => {
        res.error422(`Error de validación`)
      })
      server2.addRoute('GET', '/error', (req, res, next) => {
        res.error422(`Error de validación`)
      })
    })
  })

  describe(` Método: listen`, () => {
    it('Verificando el servidor express', (done) => {
      server1.listen(7081)
      server2.listen(7082)
      request('http://localhost:7081/home', (error, response, body) => {
        body = JSON.parse(body)
        expect(typeof body).to.equal('object')
        expect(body.status).to.equal('OK')
        expect(body.code).to.equal(200)
        expect(body.data).to.equal('Bienvenido al mundo real JHON SMITH')
        expect(response.statusCode).to.equal(200)
        request('http://localhost:7081/error', (error, response, body) => {
          body = JSON.parse(body)
          expect(typeof body).to.equal('object')
          expect(body.status).to.equal('FAIL')
          expect(body.code).to.equal(422)
          expect(body.msg).to.equal('Error de validación')
          expect(response.statusCode).to.equal(422)
          request('http://localhost:7082/error', (error, response, body) => {
            body = JSON.parse(body)
            expect(typeof body).to.equal('object')
            expect(body.status).to.equal('FAIL')
            expect(body.code).to.equal(422)
            expect(body.msg).to.equal('Error de validación')
            expect(response.statusCode).to.equal(200)
            done()
          })
        })
      })
    })
  })

})
