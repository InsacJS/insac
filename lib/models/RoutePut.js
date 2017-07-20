'use strict'
const async = require('async');
const Send = require('./Send');
const Validator = require('./Validator');
const Route = require('./Route');
const f = require('../utils/functions');

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
              options.where[model.id.name] = {$notIn:[parseInt(req.params.id)]};
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

      // Validando los primaryKeys
      let primaryKeys = model.getPrimayKeys();
      let verifyKeys;
      for (let i in primaryKeys) {
        if (f.contains(validInputs, primaryKeys[i])) {
          verifyKeys = true;
          break;
        }
      }
      if (verifyKeys === true) {
        let funcKeysValidate = function(callback) {
          database.seqModels[modelName].findOne({where:{id:parseInt(req.params.id)}}).then(function(dataR) {
            if (dataR) {
              let options = {where:{}};
              options.where[model.id.name] = {$notIn:[parseInt(req.params.id)]};
              let values = [];
              for (let i in primaryKeys) {
                let pk = primaryKeys[i];
                options.where[pk] = req.body[pk] ? model.getValueParsed(pk, req.body[pk]) : dataR[pk];
                values.push(options.where[pk]);
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
            } else {
              // No existe el registro
              let valueError = req.params.id;
              let fieldError = model.id.name;
              let msg = `No existe el registro '${modelName}' con '${fieldError}' igual a '${valueError}'`;
              return callback({code:422,msg:msg});
            }
          }).catch(function(err) {
            return callback({code:500, msg:err});
          });
        }
        asycFunctions.push(funcKeysValidate);
      }

      // Validando los campos con referencias
      let [foreignKeys, foreignModels] = model.getForeignKeys();
      for (let i in foreignKeys) {
        let foreignKey = foreignKeys[i];
        let foreignModel = foreignModels[i];
        if (req.body[foreignKey]) {
          let funcForeignKeysValidate = function(callback) {
            let options = {where:{}};
            options.where[model.id.name] = model.getValueParsed(foreignKey, req.body[foreignKey]);
            database.seqModels[foreignModel].findOne(options).then(function(dataR) {
              if (dataR) {
                return callback(null);
              }
              let valueError = options.where[model.id.name];
              let fieldError = model.id.name;
              let msg = `No existe el registro '${foreignModel}' con '${fieldError}' igual a '${valueError}'`;
              return callback({code:422,msg:msg});
            }).catch(function(err) {
              return callback({code:500, msg:err});
            });
          }
          asycFunctions.push(funcForeignKeysValidate);
        }
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
            case 500: console.log(err.msg); return Send.error500(res); break;
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
