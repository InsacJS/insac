'use strict'
var async = require('async');
var Send = require('./Send');
var Validator = require('./Validator');
var Route = require('./Route');

class RoutePut extends Route {

  constructor(uri, modelName, title, version, description, headers, inputs, outputs) {
    super(uri, 'PUT', modelName, true, title, version, description, headers, inputs, outputs);
  }

  getController(models, database) {
    let modelName = this.modelName;
    let model = models[modelName];
    let inputs = this.inputs;
    let controller = function(req, res, next) {
      let asycFunctions = [];

      // Función VAL ID
      let funcIdValidate = Validator.funcIdValidate(req.params.id);
      asycFunctions.push(funcIdValidate);

      let validInputs = [];
      for (let i in inputs) {
        let input = inputs[i];
        if (req.body[input]) {
          validInputs.push(input);
          let field = model.fields[input];
          for (let j in field.validators) {
            let validator = field.validators[j];
            // Función VAL FIELD
            let funcFieldValidate = validator.funcValidate(req.body[input]);
            asycFunctions.push(funcFieldValidate);
          }

          if (field.unique) {
            let funcFieldValidateUnique = function(callback) {
              let options = {where:{}};
              let value = model.getValueParsed(input, req.body[input]);
              options.where[input] = value;
              options.where[model.id.name] = {$notIn:[parseInt(req.params.id)]}
              database.seqModels[modelName].findOne(options).then(function(dataR) {
                if (dataR) {
                  let msg = `Ya existe otro registro con el valor '${value}' del campo '${input}', y debe ser unico`;
                  return callback({code:422, msg:msg});
                }
                return callback(null);
              }).catch(function(err) {
                return callback({code:500, msg:err});
              });
            };
            asycFunctions.push(funcFieldValidateUnique);
          }

        }
      }
      if (validInputs.length == 0) {
        // Función VAL UNIQUE FIELD
        let funcFieldRequire = Validator.funcFieldRequire();
        asycFunctions.push(funcFieldRequire);
      }

      // Construir DATA
      let data = {};
      for (let i in validInputs) {
        let input = validInputs[i];
        data[input] = model.getValueParsed(input, req.body[input]);
      }
      // Función PUT
      let funcPut = function(callback) {
        let options = getOptions(req);
        database.seqModels[modelName].update(data, options).then(function(result) {
          let nroRowAffecteds = result[0];
          if (nroRowAffecteds > 0) {
            return callback(null);
          }
          return callback({code:404});
        }).catch(function(err) {
          return callback({code:500, msg:err});
        });
      };
      asycFunctions.push(funcPut);

      async.waterfall(asycFunctions, function(err, result) {
        if (err) {
          switch (err.code) {
            case 404: return Send.error404(res); break;
            case 422: return Send.error422(res, err.msg); break;
            case 500: console.log("ERROR ", err.msg); return Send.error500(res); break;
          }
        }
        Send.success201(res, result);
      });
    }
    return controller;
  }

}

module.exports = RoutePut;

function getOptions(req) {
  let options = {};
  options.where = {
    id: parseInt(req.params.id)
  }
  return options;
}
