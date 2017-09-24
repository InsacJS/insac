'use strict'
const _ = require('lodash')
const path = require('path')
const request = require('request')
const Route = require('../../../lib/core/Route')
const OutputManager = require('../../../lib/core/OutputManager')
const Fields = require('../../../lib/tools/Fields')
const Insac = require('../../../lib/Insac')

describe('\n - Clase: Route\n', () => {

  let app, projectPath = path.resolve(__dirname, './Route/app'), db

  before(`Inicializando datos de entrada`, (done) => {
    process.env.NODE_ENV = 'test'
    app = new Insac(projectPath)
    app.addModel('rol')
    app.addModel('usuario')
    app.addModel('rol_usuario')
    app.addModel('persona')
    app.addModel('carrera')
    app.addModel('administrativo')
    app.addModel('docente')
    app.addModel('estudiante')
    app.addSeeders()
    app.migrate().then(() => {
      app.seed().then(() => {
        done()
      })
    })
  })

  it('Adicionando rutas', () => {
    let db = app.db()
    app.addRoute(new Route('GET', '/admin1', {
      model: app.models.administrativo,
      output: [{
        id: Fields.THIS(),
        cargo: Fields.THIS()
      }],
      controller: (req) => {
        return db.administrativo.findAll(req.options)
      }
    }))
    app.addRoute(new Route('GET', '/admin2/:id', {
      model: app.models.administrativo,
      input: {
        params: {
          id: Fields.THIS()
        }
      },
      output: {
        id: Fields.THIS(),
        cargo: Fields.THIS(),
        persona: {
          nombre: Fields.THIS(),
          ci: Fields.THIS()
        }
      },
      controller: (req) => {
        let options = req.options
        options.where = { id:req.params.id }
        return db.administrativo.findOne(options)
      }
    }))
  })

  it('Verificando que los controladores devuelvan solamente los campos declarados en la ruta', (done) => {
    app.listen()
    request(`http://localhost:${app.config.server.port}/admin1`, (error, response, body) => {
      body = JSON.parse(body)
      expect(body.status).to.equal('OK')
      expect(body.code).to.equal(200)
      expect(Array.isArray(body.data)).to.equal(true)
      expect(body.data.length).to.equal(1)
      expect(Object.keys(body.data[0]).length).to.equal(2)
      expect(body.data[0]).to.have.property('id')
      expect(body.data[0]).to.have.property('cargo')
      request(`http://localhost:${app.config.server.port}/admin2/1?fields=all,persona(all)`, (error, response, body) => {
        body = JSON.parse(body)
        expect(body.status).to.equal('OK')
        expect(body.code).to.equal(200)
        expect(Array.isArray(body.data)).to.equal(false)
        expect(Object.keys(body.data).length).to.equal(3)
        expect(body.data).to.have.property('id')
        expect(body.data).to.have.property('cargo')
        expect(body.data).to.have.property('persona')
        expect(Object.keys(body.data.persona).length).to.equal(2)
        expect(body.data.persona).to.have.property('nombre')
        expect(body.data.persona).to.have.property('ci')
        done()
      })
    })

  })

})
