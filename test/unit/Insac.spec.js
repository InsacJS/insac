'use strict'
const _ = require('lodash')
const path = require('path')
const request = require('request')
const Insac = require('../../lib/Insac')
const Config = require('../../lib/models/Config')
const Model = require('../../lib/models/Model')
const Reference = require('../../lib/models/Reference')
const Middleware = require('../../lib/models/Middleware')

describe('\n - Clase: Insac\n', () => {
  let projectPath = path.resolve(__dirname, './Insac/app')
  let app

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto sin parámetros', () => {
      app = new Insac()
      let defaultProjectPath = Config.defaultProjectPath()
      let defaultPath = Config.defaultPath(defaultProjectPath)
      let defaultServer = Config.defaultServer()
      let defaultDatabase = Config.defaultDatabase()
      let defaultAuth = Config.defaultAuth()
      expect(app.models.length).to.equal(0)
      expect(app.middlewares.length).to.equal(0)
      expect(typeof app.server).to.not.equal('undefined')
      expect(typeof app.database).to.not.equal('undefined')
      expect(typeof app.config).to.equal('object')
      expect(app.config.env).to.equal('development')
      expect(_.isEqual(app.config.projectPath, defaultProjectPath)).to.equal(true)
      expect(_.isEqual(app.config.path, defaultPath)).to.equal(true)
      expect(_.isEqual(app.config.server, defaultServer)).to.equal(true)
      expect(_.isEqual(app.config.database, defaultDatabase)).to.equal(true)
      expect(_.isEqual(app.config.auth, defaultAuth)).to.equal(true)
    })
  })

  describe(` Método: addModel`, () => {
    it('Adicionando un modelo por defecto, solo con el nombre', () => {
      app = new Insac('test', projectPath)
      let defaultPath = Config.defaultPath(projectPath)
      expect(app.models.length).to.equal(0)
      expect(app.middlewares.length).to.equal(0)
      expect(typeof app.server).to.not.equal('undefined')
      expect(typeof app.database).to.not.equal('undefined')
      expect(typeof app.config).to.equal('object')
      expect(app.config.env).to.equal('test')
      expect(app.config.projectPath).to.equal(projectPath)
      let modelName = 'libro'
      app.addModel(modelName)
      expect(Object.keys(app.models).length).to.equal(1)
      expect(app.models[modelName] instanceof Model).to.equal(true)
      expect(app.models[modelName].name).to.equal(modelName)
    })
    it('Adicionando un modelo, desde un archivo', () => {
      let modelName = 'usuario'
      app.addModel(modelName)
      expect(Object.keys(app.models).length).to.equal(2)
      expect(app.models[modelName] instanceof Model).to.equal(true)
      expect(app.models[modelName].name).to.equal(modelName)
      expect(app.models.usuario instanceof Model).to.equal(true)
    })
    it('Adicionando un modelo previamente instanciado, con una referencia', () => {
      let persona = new Model('persona', {
        fields: {
          nombre: {},
          id_usuario: Reference.ONE_TO_ONE(app.models.usuario, {allowNull:false})
        }
      })
      app.addModel(persona)
      expect(Object.keys(app.models).length).to.equal(3)
      expect(app.models.persona instanceof Model).to.equal(true)
      expect(Object.keys(app.database.models).length).to.equal(3)
      expect(app.models.persona.name).to.equal('persona')
      expect(app.models.usuario.options.associations.length).to.equal(1)
      expect(app.models.persona.options.associations.length).to.equal(0)
    })
  })

  describe(` Método: addMiddleware`, () => {
    it('Adicionando un middleware global', () => {
      app.addMiddleware('/api', (req, res, next) => {
        req.info = `Middleware global para las rutas que comienzan con '/api'`
        next()
      })
      expect(Object.keys(app.middlewares).length).to.equal(0)
    })
    it('Adicionando un middleware local', () => {
      app.addMiddleware('auth', (req, res, next) => {
        req.user = 'JHON SMITH'
        next()
      })
      expect(Object.keys(app.middlewares).length).to.equal(1)
      expect(app.middlewares.auth instanceof Middleware).to.equal(true)
    })
    it('Adicionando un middleware local a una ruta 1ra forma', () => {
      app.addMiddleware('/api/admin1', 'auth')
    })
    it('Adicionando un middleware local a una ruta 2da forma', () => {
      app.addMiddleware('/api/admin2', (req, res, next) => {
        req.user = 'JHON SMITH'
        next()
      })
    })
  })

  describe(` Método: addRoute`, () => {
    it('Adicionando varias rutas', () => {
      app.addRoute('GET', '/api/admin1', {
        controller: (req, res, next) => {
          let data = {
            msg: `Bienvenido ${req.user}`,
            info: req.info
          }
          res.success200(data)
        }
      })
      app.addRoute('GET', '/api/admin2', {
        controller: (req, res, next) => {
          let data = {
            msg: `Bienvenido ${req.user}`,
            info: req.info
          }
          res.success200(data)
        }
      })
      expect(app.routes.length).to.equal(2)
    })
  })

  describe(` Método: addRoutes`, () => {
    it('Adicionando todas las rutas desde los archivos', () => {
      app.addRoutes()
      expect(app.routes.length).to.equal(7)
    })
  })

  describe(` Método: migrate`, () => {
    it('Crea todas las tablas de la base de datos', (done) => {
      app.migrate().then(() => {
        app.database.models.persona.findAll().then(result => {
          expect(result.length).to.equal(0)
          done()
        }).catch(err => {
          done(err)
        })
      })
    })
  })

  describe(` Método: seed`, () => {
    it('Crea datos por defecto', (done) => {
      let data = [{
        id: 1,
        nombre: 'Juan Perez',
        usuario: {
          username: 'admin',
          password: 'admin'
        }
      }, {
        id: 2,
        nombre: 'Ana Mendoza',
        usuario: {
          username: 'superadmin',
          password: 'superadmin'
        }
      }, {
        id: 3,
        nombre: 'Jhon Smith',
        usuario: {
          username: 'user',
          password: 'user'
        }
      }]
      app.seed().then(result => {
        app.database.models.persona.findAll({include:[{all:true}]}).then(result => {
          result = JSON.parse(JSON.stringify(result))
          expect(result.length).to.equal(3)
          for (let i = 0; i < data.length; i++) {
            expect(result[i].id).to.equal(data[i].id)
            expect(result[i].nombre).to.equal(data[i].nombre)
            expect(result[i].usuario.username).to.equal(data[i].usuario.username)
            expect(result[i].usuario.password).to.equal(data[i].usuario.password)
          }
          done()
        }).catch(err => {
          done(err)
        })
      })
    })
  })

  describe(` Método: listen`, () => {
    it('Verificando todas las respuestas de los middlewares y las rutas', (done) => {
      app.listen()
      request(`http://localhost:${app.config.server.port}/api/admin1`, (error, response, body) => {
        body = JSON.parse(body)
        expect(body.status).to.equal('OK')
        expect(body.code).to.equal(200)
        expect(typeof body.data).to.equal('object')
        expect(body.data.msg).to.equal('Bienvenido JHON SMITH')
        expect(body.data.info).to.equal(`Middleware global para las rutas que comienzan con '/api'`)
        expect(response.statusCode).to.equal(200)
        request(`http://localhost:${app.config.server.port}/api/admin2`, (error, response, body) => {
          body = JSON.parse(body)
          expect(body.status).to.equal('OK')
          expect(body.code).to.equal(200)
          expect(typeof body.data).to.equal('object')
          expect(body.data.msg).to.equal('Bienvenido JHON SMITH')
          expect(body.data.info).to.equal(`Middleware global para las rutas que comienzan con '/api'`)
          expect(response.statusCode).to.equal(200)
          done()
        })
      })
    })
  })

})
