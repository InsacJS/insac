'use strict'
const validator = require('validator')

const INTEGER_MIN_VALUE = -999999
const INTEGER_MAX_VALUE = 999999

const ID_NAME = 'ID'
const EMAIL_NAME = 'EMAIL'
const STRING_NAME = 'STRING'
const INTEGER_NAME = 'INTEGER'
const IN_NAME = 'IN'

class Validator {

  constructor(name, args, msg) {
    this.name = name
    this.args = args
    this.msg = msg
  }

  isValid(str) {
    let a = str + ""
    switch (this.name) {
      case ID_NAME:
        return isValidInt(a, 1, INTEGER_MAX_VALUE)
      case EMAIL_NAME:
        return isValidEmail(a, this.args[0], this.args[1])
      case STRING_NAME:
        return isValidString(a, this.args[0], this.args[1])
      case INTEGER_NAME:
        return isValidInt(a, this.args[0], this.args[1])
      case IN_NAME:
        return isIn(a, this.args[0])
    }
  }

  getValue(str) {
    let a = str + ""
    switch (this.name) {
      case ID_NAME:
        return parseInt(a)
      case EMAIL_NAME:
        return a
      case STRING_NAME:
        return a
      case INTEGER_NAME:
        return parseInt(a)
      case IN_NAME:
        return a
    }
  }

}

function ID() {
  let name = ID_NAME
  let a = 1
  let b = INTEGER_MAX_VALUE
  let args = [a,b]
  let msg = `Debe ser un número entero, mayor o igual a 1`
  return new Validator(name, args, msg)
}

function EMAIL() {
  let name = EMAIL_NAME
  let args = [1, 255]
  let msg = `Debe ser una dirección de correo electrónico válida con un máximo de 255 caracteres`
  return new Validator(name, args, msg)
}

function STRING(min, max) {
  let name = STRING_NAME
  let a = (min) ? min : INTEGER_MIN_VALUE
  let b = (max) ? max : INTEGER_MAX_VALUE
  let args = [a,b]
  let msg = `Debe ser una cadena de texto entre ${a} y ${b} caracteres`
  return new Validator(name, args, msg)
}

function INTEGER(min, max) {
  let name = INTEGER_NAME
  let a = (min) ? min : INTEGER_MIN_VALUE
  let b = (max) ? max : INTEGER_MAX_VALUE
  let args = [a,b]
  let msg = `Debe ser un número entero, entre ${a} y ${b} inclusive`
  return new Validator(name, args, msg)
}

function IN(values) {
  let name = IN_NAME
  let a = values.toString()
  let args = [values]
  let msg = `Valores admitidos: '${a}'`
  return new Validator(name, args, msg)
}

Validator.ID = ID
Validator.EMAIL = EMAIL
Validator.STRING = STRING
Validator.INTEGER = INTEGER
Validator.IN = IN

module.exports = Validator

function isValidInt(str, min, max) {
  str = str + ""
  let options = {}
  options.min = (min) ? min : INTEGER_MIN_VALUE
  options.max = (max) ? max : INTEGER_MAX_VALUE
  return validator.isInt(str, options)
}

function isValidFloat(str, min, max) {
  str = str + ""
  let options = {}
  options.min = (min) ? min : INTEGER_MIN_VALUE
  options.max = (max) ? max : INTEGER_MAX_VALUE
  return validator.isFloat(str, options)
}

function isValidString(str, min, max) {
  str = str + ""
  let options = {}
  options.min = (min) ? min : STRING_MIN_VALUE
  options.max = (max) ? max : STRING_MAX_VALUE
  return validator.isLength(str, options)
}

function isValidEmail(str, min, max) {
  str = str + ""
  return (isValidString(str, min, max) && validator.isEmail(str))
}

function isValidURL(str) {
  return validator.isURL(str)
}

function isValidDate(str) {
  return validator.toDate(str) != null
}

function isAfterDate(str, date) {
  return validator.isAfter(str, date)
}

function isBeforeDate(str, date) {
  return validator.isBefore(str, date)
}

function isIn(str, values) {
  return validator.isIn(str, values)
}

function isEmpty(object) {
  return _.isEmpty(object)
}

function isValidHour(str) {
  return validator.matches(str, '([01]?[0-9]|2[0-3]):[0-5][0-9]', 'i')
}
