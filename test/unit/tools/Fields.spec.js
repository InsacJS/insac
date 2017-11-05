'use strict'
const Fields = require('../../../lib/tools/Fields')
const Model = require('../../../lib/core/Model')
const Field = require('../../../lib/fields/Field')
const Reference = require('../../../lib/fields/Reference')
const INTEGER = require('../../../lib/datatypes/INTEGER')
const STRING = require('../../../lib/datatypes/STRING')
const Validator = require('../../../lib/validators/Validator')
const EmailValidator = require('../../../lib/validators/EmailValidator')
const StringValidator = require('../../../lib/validators/StringValidator')
const IntegerValidator = require('../../../lib/validators/IntegerValidator')

describe('\n - Clase: Fields\n', () => {

  describe(` Método (static): THIS`, () => {
    it('Verificando valor', () => {
      let otherField = new Field({required:true,description:'descripción'})
      let func = Fields.THIS({required:false})
      expect(typeof func).to.equal('function')
      let newField = func(otherField)
      expect(newField instanceof Field).to.equal(true)
      expect(newField.required).to.equal(false)
      expect(newField.description).to.equal('descripción')
    })
  })

  describe(` Método (static): COPY`, () => {
    it('Verificando valor', () => {
      let otherField = new Field({required:true,description:'descripción'})
      let newField = Fields.COPY(otherField)
      expect(newField instanceof Field).to.equal(true)
      expect(newField.required).to.equal(true)
      expect(newField.description).to.equal('descripción')
    })
  })

  describe(` Método (static): ID`, () => {
    it('Verificando la instancia ID', () => {
      let field = Fields.ID()
      expect(field instanceof Field).to.equal(true)
      expect(field.type instanceof INTEGER).to.equal(true)
      expect(field.description).to.equal('Identificador único')
      expect(field.required).to.equal(true)
      expect(field.primaryKey).to.equal(true)
      expect(field.autoIncrement).to.equal(true)
    })
  })

  describe(` Método (static): EMAIL`, () => {
    it('Verificando la instancia EMAIL', () => {
      let field = Fields.EMAIL()
      expect(field instanceof Field).to.equal(true)
      expect(field.type instanceof STRING).to.equal(true)
      expect(field.description).to.equal('Dirección de correo electrónico')
      expect(field.required).to.equal(false)
      expect(field.primaryKey).to.equal(false)
      expect(field.autoIncrement).to.equal(false)
      expect(field.validator instanceof EmailValidator).to.equal(true)
    })
  })

  describe(` Método (static): TOKEN`, () => {
    it('Verificando la instancia TOKEN', () => {
      let field = Fields.TOKEN({validator:null})
      expect(field instanceof Field).to.equal(true)
      expect(field.type instanceof STRING).to.equal(true)
      expect(field.description).to.equal('Token de acceso')
      expect(field.required).to.equal(false)
      expect(field.primaryKey).to.equal(false)
      expect(field.autoIncrement).to.equal(false)
      expect(field.validator).to.equal(null)
    })
  })

  describe(` Método (static): STRING`, () => {
    it('Verificando la instancia STRING sin parámetros', () => {
      let field = Fields.STRING()
      expect(field instanceof Field).to.equal(true)
      expect(field.type instanceof STRING).to.equal(true)
    })
    it('Verificando la instancia STRING con 1 argumento 1ra forma', () => {
      let field = Fields.STRING(200)
      expect(field instanceof Field).to.equal(true)
      expect(field.type instanceof STRING).to.equal(true)
      expect(field.validator instanceof StringValidator).to.equal(true)
      expect(field.validator.max).to.equal(200)
      expect(field.required).to.equal(false)
    })
    it('Verificando la instancia STRING con 1 argumento 2da forma', () => {
      let field = Fields.STRING({required:true})
      expect(field instanceof Field).to.equal(true)
      expect(field.type instanceof STRING).to.equal(true)
      expect(field.required).to.equal(true)
    })
    it('Verificando la instancia STRING con 2 argumentos', () => {
      let field = Fields.STRING(200, {description:'custom'})
      expect(field instanceof Field).to.equal(true)
      expect(field.type instanceof STRING).to.equal(true)
      expect(field.validator.max).to.equal(200)
      expect(field.required).to.equal(false)
      expect(field.description).to.equal('custom')
    })
  })

  describe(` Método (static): INTEGER`, () => {
    it('Verificando la instancia INTEGER sin parámetros', () => {
      let field = Fields.INTEGER()
      expect(field instanceof Field).to.equal(true)
      expect(field.type instanceof INTEGER).to.equal(true)
    })
    it('Verificando la instancia INTEGER con argumentos', () => {
      let field = Fields.INTEGER({required:true, description:'custom'})
      expect(field instanceof Field).to.equal(true)
      expect(field.type instanceof INTEGER).to.equal(true)
      expect(field.validator instanceof IntegerValidator).to.equal(true)
      expect(field.validator.min).to.equal(1)
      expect(field.required).to.equal(true)
      expect(field.description).to.equal('custom')
    })
  })

})
