'use strict'
var async = require('async');
var Send = require('./Send');
var Validator = require('./Validator');
var Route = require('./Route');

class RoutePost extends Route {

  constructor(uri, modelName, title, version, description, headers, inputs, outputs) {
    super(uri, 'POST', modelName, false, title, version, description, headers, inputs, outputs);
  }

  getController(models, database) {
    let modelName = this.modelName;
    let model = models[modelName];
    let inputs = this.inputs;
    let controller = function(req, res, next) {
      let asycFunctions = [];

      for (let i in inputs) {
        let input = inputs[i];
        if (req.body[input]) {
          let field = model.fields[input];
          for (let j in field.validators) {
            let validator = field.validators[j];
            // Función VAL FIELD
            let funcFieldValidate = validator.funcValidate(req.body[input]);
            asycFunctions.push(funcFieldValidate);
          }
        } else {
          // Función FIELD NOT FOUND
          let funcFieldNotFoundValidate = Validator.funcFieldNotFoundValidate(input, req.body[input]);
          asycFunctions.push(funcFieldNotFoundValidate);
        }
      }
      // Construir DATA
      let data = {};
      for (let i in inputs) {
        let input = inputs[i];
        data[input] = model.getValueParsed(input, req.body[input]);
      }
      // Función POST
      let funcPost = function(callback) {
        database.seqModels[modelName].create(data).then(function(data) {
          return callback(null, data);
        }).catch(function(err) {
          return callback({code:500, msg:err});
        });
      };
      asycFunctions.push(funcPost);

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

module.exports = RoutePost;
