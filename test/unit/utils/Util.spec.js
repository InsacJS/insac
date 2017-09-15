'use strict'
const path = require('path')
const Util = require('../../../lib/utils/Util')

describe('\n - Clase: Util\n', () => {

  describe(` Método (static): getContentFiles`, () => {
    it(`Devuelve todos los archivos encontrados`, () => {
      let searchPath = path.resolve(__dirname, 'Util/models')
      let files = Util.getContentFiles(searchPath)
      expect(Array.isArray(files)).to.equal(true)
      expect(Object.keys(files).length).to.equal(4)
    })
    it(`Devuelve un archivo en especifico`, () => {
      let searchPath = path.resolve(__dirname, 'Util/models')
      let files = Util.getContentFiles(searchPath, {fileName:'rol'})
      expect(Array.isArray(files)).to.equal(true)
      expect(Object.keys(files).length).to.equal(1)
    })
    it(`Devuelve un archivo que no existe`, () => {
      let searchPath = path.resolve(__dirname, 'Util/models')
      let files = Util.getContentFiles(searchPath, {fileName:'inexistent'})
      expect(Array.isArray(files)).to.equal(true)
      expect(Object.keys(files).length).to.equal(0)
    })
  })

  describe(` Método (static): overrideProperties`, () => {
    it(`Sobreescribe las propiedades de un objeto con los valores de otro.`, () => {
      let objA = {
        one: 'ONE',
        two: 'TWO',
        three: {
          val: 'THREE',
          four: {
            val: 'FOUR'
          }
        }
      }
      let objB = {
        two: 2,
        three: {
          four: {
            val: 4
          }
        }
      }
      Util.overrideProperties(objA, objB)
      expect(objA.one).to.equal(objA.one)
      expect(objA.two).to.equal(objB.two)
      expect(objA.three.val).to.equal(objA.three.val)
      expect(objA.three.four.val).to.equal(objB.three.four.val)
    })
  })

  describe(` Método (static): createToken`, () => {
    it(`Crea un token con datos válidos`, () => {
      let data = {
        id: 1,
        user: 'admin'
      }
      let token = Util.createToken(data, 'SECRET')
      expect(typeof token).to.equal('string')
    })
  })

  describe(` Método (static): decodeToken`, () => {
    it(`Decodifica un token válido`, () => {
      let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MDM3NTc3NDcwMjQsImp0aSI6ImYxZjVqdmNzNjkiLCJleHAiOjE1MDM3NTc4MzM0MjQsImRhdGEiOnsibmFtZSI6InRva2VuIn19.fSif4sxKK3itvuk63yY3pjBdpaBnaEugkl7F5WCwmak'
      let tokenDecoded = Util.decodeToken(token, 'SECRET')
      expect(typeof tokenDecoded).equal('object')
      expect(tokenDecoded).to.have.property('iat')
      expect(tokenDecoded).to.have.property('jti')
      expect(tokenDecoded).to.have.property('exp')
      expect(tokenDecoded).to.have.property('data')
    })
    it(`Decodifica un token inválido`, () => {
      let token = 'admin'
      try { let tokenDecoded = Util.decodeToken(token, 'SECRET') } catch(err) { }
      expect(typeof tokenDecoded).to.equal('undefined')
    })
  })

  describe(` Método (static): encryptPassword`, () => {
    it(`Encripta un password`, () => {
      let pass = 'admin'
      let passToSave = Util.encryptPassword(pass)
      expect(typeof passToSave).to.equal('string')
      expect(passToSave.length >= 1).to.equal(true)
      expect(passToSave).to.not.equal(pass)
    })
    it(`Encripta un password vacio`, () => {
      let pass = ''
      let passToSave = Util.encryptPassword(pass)
      expect(typeof passToSave).to.equal('string')
      expect(passToSave.length >= 1).to.equal(true)
      expect(passToSave).to.not.equal(pass)
    })
  })

})
