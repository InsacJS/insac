'use strict'
const _ = require('lodash')
const Middleware = require('../../../lib/models/Middleware')

describe('\n - Clase: Middleware\n', () => {

  describe(` Método: constructor`, () => {
    it('Instancia de un objeto Middleware', () => {
      let name = 'auth', controller = (req, res, next) => {}
      let middleware = new Middleware(name, controller)
      expect(typeof middleware).to.equal('object')
      expect(middleware.name).to.equal(name)
      expect(typeof middleware.controller).to.equal('function')
    })
  })

})
