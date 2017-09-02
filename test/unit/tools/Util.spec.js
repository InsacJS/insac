'use strict'
const Util = require('../../../lib/tools/Util')

describe('\n - Clase: Util\n', () => {

  describe(` Método: createToken`, () => {
    it(`Crea un token con datos válidos`, () => {
      let data = {
        id: 1,
        user: 'admin'
      }
      let token = Util.createToken(data, 'SECRET')
      expect(typeof token).to.equal('string')
    })
  })

  describe(` Método: decodeToken`, () => {
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
      let tokenDecoded = Util.decodeToken(token, 'SECRET')
      expect(typeof tokenDecoded).to.equal('undefined')
    })
  })

  describe(` Método: encryptPassword`, () => {
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
