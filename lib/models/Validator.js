'use strict'

class Validator {

  constructor(name, args, msg) {
    this.name = name;
    this.args = args;
    this.msg = msg;
  }

  static createMsg(validatorName, validatorArgs, fieldName) {
    let msg;
    switch (validatorName) {
      case 'len':
        let a = validatorArgs[0];
        let b = validatorArgs[1];
        msg = `El campo '${fieldName}' debe tener entre ${a} y ${b} caracteres`;
        break;
      case 'isIn':
        let a = validatorArgs.toString();
        msg = `El campo '${fieldName}' solo acepta los valores: ${a}`;
        break;
      default:
        msg = `No se reconoce el validador del campo '${fieldName}'`;
    }
    return msg;
  }

}

module.exports = Validator;
