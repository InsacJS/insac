'use strict'

class Validator {

  constructor(name, args, msg) {
    this.name = name;
    this.args = args;
    this.msg = msg;
  }

  static createMsg(validatorName, validatorArgs, fieldName) {
    let msg;
    switch (name) {
      case 'len':
        let a = args[0];
        let b = args[1];
        msg = `El campo '${fieldname}' debe tener entre ${a} y ${b} caracteres`;
        break;
      case 'isIn':
        let a = args.toString();
        msg = `El campo '${fieldname}' solo acepta los valores: ${a}`;
        break;
      default:
        msg = `No se reconoce el validador del campo '${fieldname}'`;
    }
    return msg;
  }

}

module.exports = Validator;
