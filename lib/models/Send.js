'use strict'
var Config = require('../Config');

const ERROR_400 = 'ERROR_CAMPO';
const ERROR_401 = 'ERROR_AUTENTICACION';
const ERROR_403 = 'ERROR_ACCESO';
const ERROR_404 = 'ERROR_RECURSO';
const ERROR_422 = 'ERROR_VALIDACION';
const ERROR_500 = 'ERROR_SERVIDOR';

const ERROR_400_MSG = 'Faltan algunos campos';
const ERROR_401_MSG = 'Requiere autenticación';
const ERROR_403_MSG = 'Acceso denegado';
const ERROR_404_MSG = 'El recurso no existe';
const ERROR_422_MSG = 'Algunos datos no son válidos';
const ERROR_500_MSG = 'Error del servidor';

const STATUS_OK   = 'OK';
const STATUS_FAIL = 'FAIL';

class Send {

  static success200(res, data, metadata) {
    let code = 200;
    let response = {};
    if (Config.response.sendStatus) response.status = STATUS_OK;
    if (Config.response.sendCode) response.code = code;
    if (data) response.data = data;
    if (metadata) response.metadata = metadata;
    return res.status(code).json(response);
  }

  static success201(res, data) {
    let code = 201;
    let response = {};
    if (Config.response.sendStatus) response.status = STATUS_OK;
    if (Config.response.sendCode) response.code = code;
    if (data) response.data = data;
    if (Config.response.all200 === true) code = 200;
    return res.status(code).json(response);
  }

  static error400(res, message = ERROR_400_MSG) {
    let code = 400;
    let response = {};
    response.status = STATUS_FAIL;
    response.type = ERROR_400;
    response.code = code;
    response.message = message;
    return res.status(code).json(response);
  }

  static error401(res, message = ERROR_401_MSG) {
    let code = 401;
    let response = {};
    response.status = STATUS_FAIL;
    response.type = ERROR_401;
    response.code = code;
    response.message = message;
    if (Config.response.all200 === true) code = 200;
    return res.status(code).json(response);
  }

  static error403(res, message = ERROR_403_MSG) {
    let code = 403;
    let response = {};
    response.status = STATUS_FAIL;
    response.type = ERROR_403;
    response.code = code;
    response.message = message;
    if (Config.response.all200 === true) code = 200;
    return res.status(code).json(response);
  }

  static error404(res, message = ERROR_404_MSG) {
    let code = 404;
    let response = {};
    response.status = STATUS_FAIL;
    response.type = ERROR_404;
    response.code = code;
    response.message = message;
    if (Config.response.all200 === true) code = 200;
    return res.status(code).json(response);
  }

  static error422(res, message = ERROR_422_MSG) {
    let code = 422;
    let response = {};
    response.status = STATUS_FAIL;
    response.type = ERROR_422;
    response.code = code;
    response.message = message;
    if (Config.response.all200 === true) code = 200;
    return res.status(code).json(response);
  }

  static error500(res, message = ERROR_500_MSG) {
    let code = 500;
    let response = {};
    response.status = STATUS_FAIL;
    response.type = ERROR_500;
    response.code = code;
    response.message = message;
    if (Config.response.all200 === true) code = 200;
    return res.status(code).json(response);
  }

}

module.exports = Send;
