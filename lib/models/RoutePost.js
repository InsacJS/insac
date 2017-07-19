'use strict'
const async = require('async');
const Send = require('./Send');
const Validator = require('./Validator');
const Route = require('./Route');
const f = require('../utils/functions');

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
          if (field.unique) {
            let funcFieldValidateUnique = function(callback) {
              let options = {where:{}};
              let value = model.getValueParsed(input, req.body[input]);
              options.where[input] = value;
              database.seqModels[modelName].findOne(options).then(function(dataR) {
                if (dataR) {
                  let msg = `Ya existe un registro con el valor '${value}' del campo '${input}', y debe ser unico`;
                  return callback({code:422, msg:msg});
                }
                return callback(null);
              }).catch(function(err) {
                return callback({code:500, msg:err});
              });
            };
            asycFunctions.push(funcFieldValidateUnique);
          }
        } else {
          // Función FIELD NOT FOUND
          let funcFieldNotFoundValidate = Validator.funcFieldNotFoundValidate(input, req.body[input]);
          asycFunctions.push(funcFieldNotFoundValidate);
        }
      }

      // Validando los primaryKeys
      let primaryKeys = model.getPrimayKeys();
      let verifyKeys = true;
      for (let i in primaryKeys) {
        if (!f.contains(inputs, primaryKeys[i])) {
          verifyKeys = false;
          break;
        }
      }
      if (verifyKeys) {
        let funcKeysValidate = function(callback) {
          let options = {where:{}};
          let values = [];
          for (let i in primaryKeys) {
            let pk = primaryKeys[i];
            if (req.body[pk]) {
              options.where[pk] = model.getValueParsed(pk, req.body[pk]);
              values.push(options.where[pk]);
            }
          }
          database.seqModels[modelName].findOne(options).then(function(dataR) {
            if (dataR) {
              let valuesError = values;
              let fieldsError = primaryKeys.toString();
              let msg = `Ya existe un registro con los valores '${valuesError}' de los campos '${fieldsError}' y debe ser único`;
              return callback({code:422,msg:msg});
            }
            return callback(null);
          }).catch(function(err) {
            return callback({code:500, msg:err});
          });
        }
        asycFunctions.push(funcKeysValidate);
      }

      // Construir DATA
      let data = {};
      for (let i in inputs) {
        let input = inputs[i];
        if (req.body[input]) {
          data[input] = model.getValueParsed(input, req.body[input]);
        }
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

module.exports = RoutePost;
