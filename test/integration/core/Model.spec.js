'use strict'
const _ = require('lodash')
const path = require('path')
const Config = require('../../../lib/core/Config')
const Fields = require('../../../lib/tools/Fields')
const Insac = require('../../../lib/Insac')

describe('\n - Clase: Model\n', () => {

  let app, projectPath = path.resolve(__dirname, './Model/app'), db

  before(`Inicializando datos de entrada`, () => {
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
  })

  it('Verificando la propiedad queryOptions para el modelo administrativo 1', () => {
    let output = {
      id: Fields.THIS(),
      cargo: Fields.THIS(),
      id_persona: Fields.THIS(),
      persona: {
        id: Fields.THIS(),
        nombre: Fields.THIS(),
        paterno: Fields.THIS(),
        materno: Fields.THIS(),
        ci: Fields.THIS(),
        email: Fields.THIS(),
        direccion: Fields.THIS(),
        telefono: Fields.THIS(),
        id_usuario: Fields.THIS(),
        usuario: {
          id: Fields.THIS(),
          username: Fields.THIS(),
          password: Fields.THIS(),
          nombre: Fields.THIS(),
          email: Fields.THIS()
        }
      }
    }
    let db = app.db()
    let administrativoOptions = app.models.administrativo.queryOptions(output, app.models, db)
    let options = {
      attributes: ['id','cargo','id_persona'],
      include: [
        {model:db.persona, as:'persona', attributes:['id','nombre','paterno','materno','ci','email','direccion','telefono','id_usuario'], include:[
          {model:db.usuario, as:'usuario', attributes:['id','username','password','nombre','email'] }
        ]}
      ]
    }
    expect(_.isEqual(administrativoOptions, options)).to.equal(true)
  })

  it(`Verificando que la propiedad queryOptions incluya los id's aunque no se los pida`, () => {
    let output = {
      cargo: Fields.THIS(),
      persona: {
        nombre: Fields.THIS(),
        usuario: {
          username: Fields.THIS()
        }
      }
    }
    let db = app.db()
    let administrativoOptions = app.models.administrativo.queryOptions(output, app.models, db)
    let options = {
      attributes: ['id','cargo','id_persona'],
      include: [
        {model:db.persona, as:'persona', attributes:['id','nombre','id_usuario'], include:[
          {model:db.usuario, as:'usuario', attributes:['id','username'] }
        ]}
      ]
    }
    expect(_.isEqual(administrativoOptions, options)).to.equal(true)
  })

  it(`Verificando que la propiedad queryOptions incluya modelos asociados`, () => {
    let output = {
      cargo: Fields.THIS(),
      persona: {
        nombre: Fields.THIS(),
        usuario: {
          username: Fields.THIS(),
          roles_usuarios: [{
            estado: Fields.THIS(),
            id_usuario: Fields.THIS(),
            id_rol: Fields.THIS(),
            rol: {
              nombre: Fields.THIS(),
              alias: Fields.THIS()
            },
            usuario: {
              username: Fields.THIS(),
              roles_usuarios: [{
                estado: Fields.THIS(),
                id_usuario: Fields.THIS(),
                id_rol: Fields.THIS(),
                rol: {
                  nombre: Fields.THIS(),
                  alias: Fields.THIS()
                }
              }]
            }
          }]
        }
      }
    }
    let db = app.db()
    let administrativoOptions = app.models.administrativo.queryOptions(output, app.models, db)
    let options = {
      attributes: ['id','cargo','id_persona'],
      include: [
        {model:db.persona, as:'persona', attributes:['id','nombre','id_usuario'], include:[
          {model:db.usuario, as:'usuario', attributes:['id','username'], include:[
            {model:db.rol_usuario, as:'roles_usuarios', attributes:['id','estado','id_usuario','id_rol'], include:[
              {model:db.usuario, as:'usuario', attributes:['id','username'], include:[
                {model:db.rol_usuario, as:'roles_usuarios', attributes:['id','estado','id_usuario','id_rol'], include:[
                  {model:db.rol, as:'rol', attributes:['id','nombre','alias']}
                ]}
              ]},
              {model:db.rol, as:'rol', attributes:['id','nombre','alias']}
            ]}
          ]}
        ]}
      ]
    }
    expect(_.isEqual(administrativoOptions, options)).to.equal(true)
  })

})
