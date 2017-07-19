'use strict'
const validator = require('validator');
const _ = require('lodash');

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
      case 'isInt': isValid = isValidInt(str, this.args[0], this.args[1]); break;
      case 'isDate': isValid = isValidDate(str); break;
    }
    let valFunction = function(callback) {
      if (isValid) {
        return callback(null);
      }
      return callback({code:422, msg:msg});
    };
    return valFunction;
  }

  static funcIdValidate(str) {
    let msg = `El valor '${str}' del parámetro 'id' es inválido - Debe ser un número entero mayor o igual a 1`;
    let isValid = isValidInt(str, 1);
    let valFunction = function(callback) {
      if (isValid) { return callback(null); }
      return callback({code:422, msg:msg});
    };
    return valFunction;
  }

  static funcFieldNotFoundValidate(fieldName, value) {
    let msg = `Se requiere el campo '${fieldName}'`;
    let valFunction = function(callback) {
      return callback({code:422, msg:msg});
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
        if (validatorArgs.length != 2) {
          msg = `Los argumentos '${validatorArgs}' no son admitidos por el validador ${validatorName}`;
          throw new Error(msg);
        }
        a = validatorArgs[0];
        b = validatorArgs[1];
        if (!(isValidInt(a + '', 1)) || !(isValidInt(b + '', 1))) {
          msg = `Los argumentos '${a}' y '${b}' del validador '${validatorName}' deben ser números enteros`;
          throw new Error(msg);
        }
        if (b < a) {
          msg = `El argumento 2 '${b}' debe ser mayor o igual que el argumento 1 '${a}'`;
          throw new Error(msg);
        }
        msg = `El campo '${fieldName}' debe tener entre ${a} y ${b} caracteres`;
        break;
      case 'isIn':
        a = validatorArgs[0].toString();
        msg = `El campo '${fieldName}' solo acepta los valores: ${a}`;
        break;
      case 'isInt':
        a = validatorArgs[0];
        b = validatorArgs[1];
        if (a && b) msg = `El campo '${fieldName}' debe ser un número entero mayor o igual a ${a} y  menor o igual a ${b}`;
        if (a && !b) msg = `El campo '${fieldName}' debe ser un número entero mayor o igual a ${a}`;
        if (!a && b) msg = `El campo '${fieldName}' debe ser un número entero menor o igual a ${b}`;
        if (!a && !b) msg = `El campo '${fieldName}' debe ser un número entero`;
        break;
      case 'isDate':
        msg = `El campo '${fieldName}' debe ser una fecha válida`;
        break;
      default:
        msg = `No existe el validador '${validatorName}'`;
        throw new Error(msg);
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
