'use strict'
const _ = require('lodash')
const path = require('path')
const request = require('request')
const Insac = require('../../lib/Insac')
const Config = require('../../lib/core/Config')
const Server = require('../../lib/core/Server')
const Database = require('../../lib/core/Database')
const Model = require('../../lib/core/Model')
const Route = require('../../lib/core/Route')
const Seed = require('../../lib/core/Seed')
const Fields = require('../../lib/tools/Fields')
const Field = require('../../lib/fields/Field')
const Reference = require('../../lib/fields/Reference')
const Middleware = require('../../lib/core/Middleware')

describe('\n - Clase: Insac\n', () => {
  let app, projectPath = path.resolve(__dirname, './Insac/app'), db

  describe(` Método: constructor`, () => {
    it('Instanciando un objeto sin parámetros', () => {
      app = new Insac()
      let defaultConfig = new Config()
      expect(Object.keys(app.models).length).to.equal(0)
      expect(Object.keys(app.middlewares).length).to.equal(0)
      expect(app.server instanceof Server).to.equal(true)
      expect(app.database instanceof Database).to.equal(true)
      expect(app.config instanceof Config).to.equal(true)
      expect(app.config.env).to.equal('development')
      expect(_.isEqual(app.config, defaultConfig)).to.equal(true)
    })
    it('Instanciando un objeto con parámetros', () => {
      app = new Insac('test', projectPath)
      expect(app.config instanceof Config).to.equal(true)
      expect(app.config.env).to.equal('test')
      expect(app.config.projectPath).to.equal(projectPath)
      expect(app.config.path.config).to.equal(path.resolve(projectPath,'./config'))
      expect(app.config.path.middlewares).to.equal(path.resolve(projectPath,'./middlewares'))
      expect(app.config.path.models).to.equal(path.resolve(projectPath,'./models'))
      expect(app.config.path.routes).to.equal(path.resolve(projectPath,'./routes'))
      expect(app.config.path.resources).to.equal(path.resolve(projectPath,'./resources'))
      expect(app.config.path.seeders).to.equal(path.resolve(projectPath,'./seeders'))
      expect(Object.keys(app.middlewares).length).to.equal(0)
      expect(Object.keys(app.seeders).length).to.equal(0)
    })
  })

  describe(` Método: addModel`, () => {
    it('Adicionando directamente la instancia de un modelo', () => {
      app.addModel(new Model('libro'))
      expect(Object.keys(app.models).length).to.equal(1)
      expect(app.models.libro instanceof Model).to.equal(true)
      expect(app.models.libro.name).to.equal('libro')
    })
    it('Adicionando un modelo, desde un archivo 1', () => {
      app.addModel('usuario')
      expect(Object.keys(app.models).length).to.equal(2)
      expect(app.models.usuario instanceof Model).to.equal(true)
      expect(app.models.usuario.name).to.equal('usuario')
    })
    it('Adicionando un modelo desde un archivo 2', () => {
      app.addModel('persona')
      expect(Object.keys(app.models).length).to.equal(3)
      expect(app.models.persona instanceof Model).to.equal(true)
      expect(Object.keys(app.database.sequelizeModels).length).to.equal(3)
      expect(app.models.persona.name).to.equal('persona')
    })
  })

  describe(` Método: addMiddleware`, () => {
    it('Adicionando un middleware global', () => {
      app.addMiddleware(new Middleware('/api', {
        controller:(req, res, next) => {
          req.info = `Middleware global para la API`
          next()
        }
      }))
      expect(Object.keys(app.middlewares).length).to.equal(1)
      expect(typeof app.middlewares['/api']).to.equal('function')
    })
    it('Adicionando un middleware local', () => {
      app.addMiddleware(new Middleware('welcome', {
        controller:(req, res, next) => {
          req.user = 'JHON SMITH'
          next()
        }
      }))
      expect(Object.keys(app.middlewares).length).to.equal(2)
      expect(typeof app.middlewares['welcome']).to.equal('function')
    })
  })

  describe(` Método: addMiddlewares`, () => {
    it('Adicionando todos los middlewares desde los archivos', () => {
      app.addMiddlewares()
      expect(Object.keys(app.middlewares).length).to.equal(3)
    })
  })

  describe(` Método: addRoute`, () => {
    it('Adicionando instancias', () => {
      app.addRoute(new Route('GET', '/api/admin', {
        output: {
          msg: Fields.STRING(),
          info: Fields.STRING()
        },
        middlewares: [ { name:'welcome' } ],
        controller: (req) => {
          let data = {
            msg: `Bienvenido ${req.user}`,
            info: req.info
          }
          return data
        }
      }))
      expect(app.routes.length).to.equal(1)
    })
  })

  describe(` Método: addRoutes`, () => {
    it('Adicionando todas las rutas desde los archivos', () => {
      app.addRoutes()
      expect(app.routes.length).to.equal(2)
    })
  })

  describe(` Método: migrate`, () => {
    it('Crea todas las tablas de la base de datos', (done) => {
      db = app.db()
      app.migrate().then(() => {
        db.persona.findAll().then(result => {
          expect(result.length).to.equal(0)
          done()
        }).catch(err => {
          done(err)
        })
      }).catch(err => {
        done(err)
      })
    })
  })

  describe(` Método: addSeed`, () => {
    it('Adicionando una instancia de la calse Seed', () => {
      let data = [
        { username: 'A', password: 'A' },
        { username: 'B', password: 'B' }
      ]
      app.addSeed(new Seed('usuario', data))
      expect(Object.keys(app.seeders).length).to.equal(1)
    })
  })

  describe(` Método: addSeeders`, () => {
    it('Adicionando todos los seeders desde los archivos', () => {
      app.addSeeders()
      expect(Object.keys(app.seeders).length).to.equal(2)
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
      db = app.db()
      app.seed().then(result => {
        let options = {
          attributes: [ 'id', 'nombre' ],
          include: [ { model: db.usuario, as: 'usuario', attributes: ['username', 'password'] } ]
        }
        db.persona.findAll(options).then(result => {
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
      }).catch(err => {
        done(err)
      })
    })
  })

  describe(` Método: listen`, () => {
    it('Verificando todas las respuestas de los middlewares y las rutas', (done) => {
      app.listen()
      request(`http://localhost:${app.config.server.port}/api/admin`, (error, response, body) => {
        body = JSON.parse(body)
        expect(body.status).to.equal('OK')
        expect(body.code).to.equal(200)
        expect(typeof body.data).to.equal('object')
        expect(body.data.msg).to.equal('Bienvenido JHON SMITH')
        expect(body.data.info).to.equal(`Middleware global para la API`)
        expect(response.statusCode).to.equal(200)
        done()
      })
    })
  })

})
