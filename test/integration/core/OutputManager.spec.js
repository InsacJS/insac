'use strict'
const _ = require('lodash')
const path = require('path')
const Route = require('../../../lib/core/Route')
const OutputManager = require('../../../lib/core/OutputManager')
const Fields = require('../../../lib/tools/Fields')
const Insac = require('../../../lib/Insac')

describe('\n - Clase: OutputManager\n', () => {

  let app, projectPath = path.resolve(__dirname, './Model/app'), db

  before(`Inicializando datos de entrada`, () => {
    app = new Insac('test', projectPath)
    app.addModel('rol')
    app.addModel('usuario')
    app.addModel('rol_usuario')
    app.addModel('persona')
    app.addModel('carrera')
    app.addModel('administrativo')
    app.addModel('docente')
    app.addModel('estudiante')
  })

  it('Verificando la propiedad queryOptions para el modelo administrativo 1', () => {
    let route = new Route('GET', '/administrativos', {
      model: app.models.administrativo,
      output: {
        id: Fields.THIS(),
        cargo: Fields.THIS(),
        persona: {
          id: Fields.THIS(),
          nombre: Fields.THIS(),
          ci: Fields.THIS(),
          usuario: {
            id: Fields.THIS(),
            username: Fields.THIS(),
            roles_usuarios: [{
              id: Fields.THIS(),
              estado: Fields.THIS(),
              id_usuario: Fields.THIS(),
              id_rol: Fields.THIS(),
              rol: {
                id: Fields.THIS(),
                nombre: Fields.THIS(),
                alias: Fields.THIS()
              },
              usuario: {
                id: Fields.THIS(),
                username: Fields.THIS(),
                roles_usuarios: [{
                  id: Fields.THIS(),
                  estado: Fields.THIS(),
                  id_usuario: Fields.THIS(),
                  id_rol: Fields.THIS(),
                  rol: {
                    id: Fields.THIS(),
                    nombre: Fields.THIS(),
                    alias: Fields.THIS()
                  }
                }]
              }
            }]
          }
        }
      }
    })
    app.addRoute(route)
    let db = app.db()
    let outputManager = new OutputManager(), options, optionsOptimized, req
    outputManager.init(app.routes[route.ID()], app.models, db)
    req = {query: { fields: 'id,cargo' }}
    optionsOptimized = outputManager.getOptions(req, app.routes[route.ID()], app.models)
    options = {
      attributes: ['id','cargo']
    }
    expect(_.isEqual(optionsOptimized, options)).to.equal(true)
    req = {query: { fields: 'cargo,persona(ci)' }}
    optionsOptimized = outputManager.getOptions(req, app.routes[route.ID()], app.models)
    options = {
      attributes: ['cargo','id'],
      include: [
        {attributes:['ci','id'], model:db.persona, as:'persona'}
      ]
    }
    expect(_.isEqual(optionsOptimized, options)).to.equal(true)
    req = {query: { fields: 'cargo,persona(ci,usuario(username,roles_usuarios(estado,rol(id,nombre))))' }}
    optionsOptimized = outputManager.getOptions(req, app.routes[route.ID()], app.models)
    options = {
      attributes: ['cargo','id'],
      include: [
        {attributes:['ci','id'], model:db.persona, as:'persona', include:[
          {attributes:['username','id'], model:db.usuario, as:'usuario', include: [
            {attributes:['estado','id'], model:db.rol_usuario, as:'roles_usuarios', include:[
              {attributes:['id','nombre'], model:db.rol, as:'rol'}
            ]}
          ]}
        ]}
      ]
    }
    expect(_.isEqual(optionsOptimized, options)).to.equal(true)
    req = {query: { fields: 'all,persona(all,usuario(all,roles_usuarios(all,rol(all))))' }}
    optionsOptimized = outputManager.getOptions(req, app.routes[route.ID()], app.models)
    options = {
      attributes: ['id','cargo'],
      include: [
        {attributes:['id','nombre','ci'], model:db.persona, as:'persona', include:[
          {attributes:['id','username'], model:db.usuario, as:'usuario', include: [
            {attributes:['id','estado','id_usuario','id_rol'], model:db.rol_usuario, as:'roles_usuarios', include:[
              {attributes:['id','nombre','alias'], model:db.rol, as:'rol'}
            ]}
          ]}
        ]}
      ]
    }
    expect(_.isEqual(optionsOptimized, options)).to.equal(true)
  })

})
