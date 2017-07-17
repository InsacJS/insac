'use strict'
var async = require('async');
var Send = require('./Send');
var Validator = require('./Validator');
var Route = require('./Route');

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
          return callback({code:404});
        }).catch(function(err) {
          return callback({code:500, msg:err});
        });
      };
      asycFunctions.push(funcDelete);

      async.waterfall(asycFunctions, function(err, result) {
        if (err) {
          switch (err.code) {
            case 404: return Send.error404(res); break;
            case 422: return Send.error422(res, err.msg, err.value); break;
            case 500: console.log("ERROR ", err.msg); return Send.error500(res); break;
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
