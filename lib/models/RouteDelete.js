'use strict'
const async = require('async');
const Send = require('./Send');
const Validator = require('./Validator');
const Route = require('./Route');

class RouteDelete extends Route {

  constructor(uri, modelName, title, version, description, headers, inputs, outputs) {
    super(uri, 'DELETE', modelName, true, title, version, description, headers, inputs, outputs);
  }

  getController(models, database) {
    let modelName = this.modelName;
    let model = models[modelName];
    let controller = function(req, res, next) {
      let asycFunctions = [];

      // Función VAL ID
      let funcIdValidate = Validator.funcIdValidate(req.params.id);
      asycFunctions.push(funcIdValidate);

      // Función DELETE
      let funcDelete = function(callback) {
        let options = getOptions(req);
        database.seqModels[modelName].destroy(options).then(function(result) {
          if (result > 0) {
            return callback(null);
          }
          // No existe el registro
          let valueError = req.params.id;
          let fieldError = model.id.name;
          let msg = `No existe el registro '${modelName}' con '${fieldError}' igual a '${valueError}'`;
          return callback({code:422,msg:msg});
        }).catch(function(err) {
          if (err.name == "SequelizeForeignKeyConstraintError") {
            let msg = `No se puede elimina el registro '${modelName}' con 'id' igual a '${req.params.id}' porque está como referencia en otro registro`;
            return callback({code:422, msg:msg});
          }
          return callback({code:500, msg:err});
        });
      };
      asycFunctions.push(funcDelete);

      async.waterfall(asycFunctions, function(err, result) {
        if (err) {
          switch (err.code) {
            case 404: return Send.error404(res); break;
            case 422: return Send.error422(res, err.msg); break;
            case 500: console.log(err.msg); return Send.error500(res); break;
          }
        }
        Send.success201(res, result);
      });
    }
    return controller;
  }

}

module.exports = RouteDelete;

function getOptions(req) {
  let options = {};
  options.where = {
    id: parseInt(req.params.id)
  }
  return options;
}
