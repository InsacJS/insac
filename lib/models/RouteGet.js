'use strict'
var async = require('async');
var Send = require('./Send');
var Validator = require('./Validator');
var Route = require('./Route');

class RouteGet extends Route {

  constructor(uri, modelName, idParam, title, version, description, headers, inputs, outputs) {
    super(uri, 'GET', modelName, idParam, title, version, description, headers, inputs, outputs);
  }

  getController(models, database) {
    let modelName = this.modelName;
    let outputs = this.outputs;
    let idParam = this.idParam;

    let controller = function(req, res, next) {
      let asycFunctions = [];
      let data;
      let metadata;
      let funcGet;

      if (idParam) {
        // Función VAL ID
        let funcIdValidate = Validator.funcIdValidate(req.params.id);
        asycFunctions.push(funcIdValidate);
        // Función GET BY ID
        funcGet = function(callback) {
          let options = getOptions(req, idParam, modelName, models, outputs);
          database.seqModels[modelName].findOne(options).then(function(dataR) {
            if (dataR) {
              data = dataR;
              return callback(null);
            }
            return callback({code:404});
          }).catch(function(err) {
            return callback({code:500, msg:err});
          });
        };
      } else {
        // Función GET
        funcGet = function(callback) {
          let options = getOptions(req, idParam, modelName, models, outputs);
          database.seqModels[modelName].findAndCountAll(options).then(function(dataR) {
            let count = dataR.count;
            let start = options.offset;
            let end = options.offset + options.limit;
            if (end > count) end = count;
            res.set('Content-Range', start + '-' + end + '/' + count);
            data = dataR.rows;
            metadata = {
              count: end - start,
              totalCount: dataR.count,
              limit: options.limit,
              offset: options.offset
            };
            return callback(null);
          }).catch(function(err) {
            return callback({code:500, msg:err});
          });
        };
      }

      asycFunctions.push(funcGet);

      async.waterfall(asycFunctions, function(err, result) {
        if (err) {
          switch (err.code) {
            case 404: return Send.error404(res); break;
            case 422: return Send.error422(res, err.msg, err.value); break;
            case 500: console.log("ERROR ", err.msg); return Send.error500(res); break;
          }
        }
        Send.success200(res, data, metadata);
      });
    }
    return controller;
  }

}

module.exports = RouteGet;

function getOptions(req, idParam, modelName, models, outputs) {
  let model = models[modelName];
  let idName = model.id.name;
  let fieldsName = model.getFieldsName();

  let query = req.query;

  let options = {};
  if (idParam) {
    options.where = {};
    options.where[idName] = parseInt(req.params.id);
  } else {
    options.offset = query.offset ? parseInt(query.offset) : 0; // ?offset=1
    options.limit = query.limit ? parseInt(query.limit) : 50; // ?limit=10
  }

  // Incluimos los outputs válidos
  for (let i in outputs) {
    let out = outputs[i];
    for (let j in fieldsName) {
      let fieldName = fieldsName[j];
      if (out == fieldName) {
        if (!options.attributes) {
          options.attributes = [];
        }
        options.attributes.push(out);
        break;
      }
    }
  }
  // Filtro 'fields'
  let queryFields = query.fields ? query.fields.split(",") : ['all'];
  options.attributes = [];
  for (let i in queryFields) {
    let queryField = queryFields[i];
    for (let j in fieldsName) {
      let fieldName = fieldsName[j];
      if ((queryField == 'all') || (queryField == fieldName)) {
        options.attributes.push(fieldName);
      }
    }
  }

  if (idParam) {
    return options;
  }

  // Filtro 'where'
  for (let i in fieldsName) {
    let fieldName = fieldsName[i];
    if (query[fieldName]) {
      if (!options.where) {
        options.where = {};
      }
      options.where[fieldName] = model.getValueParsed(fieldName, query[fieldName]);
    }
  }
  // Filtro 'sort'
  let querySorts = query.sort ? query.sort.split(",") : ['id asc'];
  for (let i in querySorts) {
    let [sortFieldName, orderType] = querySorts[i].split(" ");
    if (!sortFieldName || !orderType) {
      continue;
    }
    if ((orderType.toLowerCase() == 'asc') || (orderType.toLowerCase() == 'desc')) {
      for (let j in fieldsName) {
        let fieldName = fieldsName[j];
        if (sortFieldName == fieldName) {
          if (!options.order) options.order = [];
          options.order.push([fieldName, orderType.toLowerCase()]);
          break;
        }
      }
    }
  }

  return options;
}
