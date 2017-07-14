const ERROR_CAMPO           = 'ERROR_CAMPO';
const ERROR_AUTENTICACION   = 'ERROR_AUTENTICACION';
const ERROR_ACCESO          = 'ERROR_ACCESO';
const ERROR_RECURSO         = 'ERROR_RECURSO';
const ERROR_VALIDACION      = 'ERROR_VALIDACION';
const ERROR_SERVIDOR        = 'ERROR_SERVIDOR';

class Send {

  static success200(res, data) {
    let responseData = data ? {status: "OK", data: data} : {status: "OK"};
    return res.status(200).json(responseData);
  }

  static success201(res, data) {
    let responseData = data ? {status: "OK", data: data} : {status: "OK"};
    return res.status(201).json(responseData);
  }

  static error400(res, message = "Faltan algunos campos", value = null) {
    let responseData = {code: 400, type: ERROR_CAMPO, message: message, value: value};
    return res.status(responseData.code).json({status: "FAIL", data: responseData});
  }

  static error401(res, message = "Requiere autenticación", value = null) {
    let responseData = {code: 401, type: ERROR_AUTENTICACION, message: message, value: value};
    return res.status(responseData.code).json({status: "FAIL", data: responseData});
  }

  static error403(res, message = "Acceso denegado", value = null) {
    let responseData = {code: 403, type: ERROR_ACCESO, message: message, value: value};
    return res.status(responseData.code).json({status: "FAIL", data: responseData});
  }

  static error404(res, message = "El recurso no existe", value = null) {
    let responseData = {code: 404, type: ERROR_RECURSO, message: message, value: value};
    return res.status(responseData.code).json({status: "FAIL", data: responseData});
  }

  static error422(res, message = "Algunos datos no son válidos", value = null) {
    let responseData = {code: 422, type: ERROR_VALIDACION, message: message, value: value};
    return res.status(responseData.code).json({status: "FAIL", data: responseData});
  }

  static error500(res, message = "Error del servidor", value = null) {
    let responseData = {code: 500, type: ERROR_SERVIDOR, message: message, value: value};
    return res.status(responseData.code).json({status: "FAIL", data: responseData});
  }

}

module.exports = Send;
