'use strict'
const Field = require('./Field')

function optionsQUERY(req, opt) {
  let model = opt.model

  let limit = req.query.limit || 50
  let offset = req.query.offset || 0

  let options = {limit:limit, offset:offset}
  if (req.query.sort) {options.order = buildOrder(req)}
  let where = {}
  let antecedent = ""
  for (let i in model.fields) {
    let field = model.fields[i]
    let fieldName = field.name
    if (req.query[fieldName]) {
      where[fieldName] = (field.primaryKey) ? req.query[fieldName].split(",").map(Number) : field.validator.getValue(req.query[fieldName])
    }
  }
  if (Object.keys(where).length > 0) {options.where = where}

  let foreignModels = model.getForeignModels(opt.models)
  if (foreignModels.length > 0) {options.include = []}
  for (let i in foreignModels) {
    let foreignModel = foreignModels[i]
    options.include.push(optionsQUERYInclude(req, opt, foreignModel, antecedent))
  }
  return options
}

function optionsQUERYInclude(req, opt, model, antecedent) {
  let options = {model: model.seq, required:true}
  let where = {}
  let antecedent2 = (antecedent == "") ? model.name : `${antecedent}.${model.name}`

  for (let i in model.fields) {
    let field = model.fields[i]
    let fieldNameFull = `${antecedent2}.${field.name}`
    if (req.query[fieldNameFull]) {
      where[field.name] = (field.primaryKey) ? req.query[fieldNameFull].split(",").map(Number) : field.validator.getValue(req.query[fieldNameFull])
    }
  }
  if (Object.keys(where).length > 0) {options.where = where}

  let foreignModels = model.getForeignModels(opt.models)
  if (foreignModels.length > 0) {options.include = []}
  for (let i in foreignModels) {
    let foreignModel = foreignModels[i]
    options.include.push(optionsQUERYInclude(req, opt, foreignModel, antecedent2))
  }
  return options
}

function buildOrder(req) {
  let order = []
  let splitReq = req.query.sort.split(",")
  for (let i in splitReq) {
    let [fieldName, orderType] = splitReq[i].split(" ")
    let fieldNameArgs = fieldName.split(".")
    fieldNameArgs.push(orderType)
    order.push(fieldNameArgs)
  }
  return order
}

function optionsID(req, opt) {
  let model = opt.model
  let pk = model.getPK()
  let options = {where:{}}
  options.where[pk.name] = opt.input.params[pk.name]
  let foreignModels = model.getForeignModels(opt.models)
  if (foreignModels.length > 0) {options.include = []}
  for (let i in foreignModels) {
    let foreignModel = foreignModels[i]
    options.include.push(optionsIDInclude(req, opt, foreignModel))
  }
  return options
}

function optionsIDInclude(req, opt, model, antecedent) {
  let options = {model: model.seq, required:true}
  let foreignModels = model.getForeignModels(opt.models)
  if (foreignModels.length > 0) {options.include = []}
  for (let i in foreignModels) {
    let foreignModel = foreignModels[i]
    options.include.push(optionsIDInclude(req, opt, foreignModel))
  }
  return options
}

function metadata(result, options) {
  let limit, offset, count, totalCount
  return {count: 100}
}

function output(req, opt, result) {
  let query = req.query.fields || 'all'
  // PASO 1
  let parsedQuery = getParsedQuery(opt, query)
  // paso_2
  let outputModel = getOutputModel(parsedQuery)
  //paso_3
  let final
  if(opt.output.isArray) {
    final = []
    for (let i in result) {
      let obj = dataCopy(outputModel, result[i], opt.output.data)
      if (Object.keys(obj).length <= 0) { break }
      final.push(obj)
    }
  } else {
    final = dataCopy(outputModel, result, opt.output.data)
  }
  return final
}

function temp(parsedQuery, parsedModels, opt, fieldName) {
  if ((parsedModels.length == 0) && (opt.model.fields[fieldName] != 'undefined')) {
    if (fieldName == 'all') {
      let allFields = opt.model.getAllFields()
      for (let i in allFields) {
        parsedQuery.push({field:allFields[i].name, parent:parsedModels})
      }
    } else {
      parsedQuery.push({field:fieldName, parent:parsedModels})
    }
  } else {
    let model = opt.models[parsedModels[parsedModels.length - 1]]
    if ((typeof model != 'undefined') && (model.fields[fieldName] != 'undefined')) {
      if (fieldName == 'all') {
        let allFields = model.getAllFields()
        for (let i in allFields) {
          parsedQuery.push({field:allFields[i].name, parent:parsedModels})
        }
      } else {
        parsedQuery.push({field:fieldName, parent:parsedModels})
      }
    }
  }
}

// PASO 1
function getParsedQuery(opt, query) {
  let models = opt.models
  while(query.indexOf("()") != -1) {
    query = query.replace("()","(all)")
  }
  let parsedQuery = []
  let iniM = 0, finM = 0, iniF = 0, finF = 0, modelsQuery = [], nivel = 0
  for (let index in query) {
    let c = query[index]
    if (c == ",") {
      finF = parseInt(index) - iniF
      if (finF > 1) {
        let fieldName = query.substr(iniF, finF)
        let parsedModels = getParsedModels(modelsQuery, nivel - 1)
        temp(parsedQuery, parsedModels, opt, fieldName)
      }
      iniF = parseInt(index) + 1
      iniM = parseInt(index) + 1
    }
    if (c == "(") {
      finM = parseInt(index) - iniM
      let modelName = query.substr(iniM, finM)
      modelsQuery[nivel] = modelName
      nivel++
      iniF = parseInt(index) + 1
      iniM = parseInt(index) + 1
    }
    if (c == ")") {
      finF = parseInt(index) - iniF
      finM = parseInt(index) - iniM
      if (finF > 1) {
        let fieldName = query.substr(iniF, finF)
        let parsedModels = getParsedModels(modelsQuery, nivel - 1)
        temp(parsedQuery, parsedModels, opt, fieldName)
      }
      iniF = parseInt(index) + 1
      iniM = parseInt(index) + 1
      nivel--
    }
    if ((parseInt(index) == (query.length - 1)) && (iniF < query.length)) {
      let fieldName = query.substr(iniF)
      let parsedModels = getParsedModels(modelsQuery, nivel - 1)
      temp(parsedQuery, parsedModels, opt, fieldName)
    }
  }
  return parsedQuery
}

function getParsedModels(models, nivel) {
  let modelsNivel = "", modelsNivelArray = []
  for (let i in models) {
    if (parseInt(i) <= nivel) {
      modelsNivel += "." + models[i]
      modelsNivelArray.push(models[i])
    }
  }
  return modelsNivelArray
}

// PASO 3
function getOutputModel(parsedQuery) {
  let obj = {}
  for (let i in parsedQuery) {
    let models = parsedQuery[i].parent
    let field = parsedQuery[i].field
    createNestedObject(obj, models, field)
  }
  return obj
}

function createNestedObject(base, names, field) {
  for(let i = 0; i < names.length; i++) {
    base = base[names[i]] = base[names[i]] || {}
  }
  base[field] = true
}

// PASO 4
function dataCopy(queryData, resultData, outputData) {
  let final = {}
  copy(final, queryData, resultData, outputData)
  return final
}

function copy(final, queryData, resultData, outputData) {
  for (let i in outputData) {
    if (queryData[i]) {
      if (outputData[i] instanceof Field) {
        final[i] = resultData[i]
      } else {
        final[i] = {}
        copy(final[i], queryData[i], resultData[i], outputData[i])
      }
    }
  }
}

let utils = {
  optionsQUERY,
  optionsID,
  metadata,
  output
}

module.exports = utils
