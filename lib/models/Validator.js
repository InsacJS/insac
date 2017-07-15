'use strict'
var validator = require('validator');
var _ = require('lodash');

const INTEGER_MIN_VALUE = -2147483647;
const INTEGER_MAX_VALUE = 2147483647;
const STRING_MIN_VALUE = 0;
const STRING_MAX_VALUE = 255;

class Validator {

  constructor(name, args, msg) {
    this.name = name;
    this.args = args;
    this.msg = msg;
  }

  funcValidate(str) {
    let msg = this.msg;
    let isValid;
    switch (this.name) {
      case 'len': isValid = isValidString(str, this.args[0], this.args[1]); break;
      case 'isIn': isValid = isIn(str, this.args[0]); break;
    }
    let valFunction = function(callback) {
      if (isValid) {
        return callback(null);
      }
      return callback({code:422, msg:msg, value:str});
    };
    return valFunction;
  }

  static funcIdValidate(str) {
    let msg = 'El valor del parámetro id es inválido - Debe ser un número entero mayor o igual a 1';
    let isValid = isValidInt(str, 1);
    let valFunction = function(callback) {
      if (isValid) { return callback(null); }
      return callback({code:422, msg:msg, value:str});
    };
    return valFunction;
  }

  static funcFieldNotFoundValidate(fieldName, value) {
    let msg = `El campo ${fieldName} es requerido`;
    let valFunction = function(callback) {
      return callback({code:422, msg:msg, value:value});
    };
    return valFunction;
  }

  static funcFieldRequire() {
    let msg = `Debe enviar al menos un campo válido`;
    let valFunction = function(callback) {
      return callback({code:422, msg:msg});
    };
    return valFunction;
  }

  static createMsg(validatorName, validatorArgs, fieldName) {
    let a, b, msg;
    switch (validatorName) {
      case 'len':
        a = validatorArgs[0];
        b = validatorArgs[1];
        msg = `El campo '${fieldName}' debe tener entre ${a} y ${b} caracteres`;
        break;
      case 'isIn':
        a = validatorArgs[0].toString();
        msg = `El campo '${fieldName}' solo acepta los valores: ${a}`;
        break;
      default:
        msg = `No se reconoce el validador del campo '${fieldName}'`;
    }
    return msg;
  }

}

module.exports = Validator;

function isValidInt(str, min, max) {
  str = str + "";
  let options = {};
  options.min = (min) ? min : INTEGER_MIN_VALUE;
  options.max = (max) ? max : INTEGER_MAX_VALUE;
  return validator.isInt(str, options);
}

function isValidFloat(str, min, max) {
  str = str + "";
  let options = {};
  options.min = (min) ? min : INTEGER_MIN_VALUE;
  options.max = (max) ? max : INTEGER_MAX_VALUE;
  return validator.isFloat(str, options);
}

function isValidString(str, min, max) {
  str = str + "";
  let options = {};
  options.min = (min) ? min : STRING_MIN_VALUE;
  options.max = (max) ? max : STRING_MAX_VALUE;
  return validator.isLength(str, options);
}

function isValidEmail(str) {
  str = str + "";
  return validator.isEmail(str);
}

function isValidURL(str) {
  return validator.isURL(str);
}

function isValidDate(str) {
  return validator.toDate(str) != null;
}

function isAfterDate(str, date) {
  return validator.isAfter(str, date);
}

function isBeforeDate(str, date) {
  return validator.isBefore(str, date);
}

function isIn(str, values) {
  return validator.isIn(str, values);
}
function isEmpty(object) {
  return _.isEmpty(object);
}
