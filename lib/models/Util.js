'use strict'
const Field = require('./Field')

function optionsQUERY(opt, req) {
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
    options.include.push(optionsQUERYInclude(opt, req, foreignModel, antecedent))
  }
  return options
}

function optionsQUERYInclude(opt, req, model, antecedent) {
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
    options.include.push(optionsQUERYInclude(opt, req, foreignModel, antecedent2))
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

function optionsID(opt, req) {
  let model = opt.model
  let pk = model.getPK()
  let options = {where:{}}
  options.where[pk.name] = opt.input.params[pk.name]
  let foreignModels = model.getForeignModels(opt.models)
  if (foreignModels.length > 0) {options.include = []}
  for (let i in foreignModels) {
    let foreignModel = foreignModels[i]
    options.include.push(optionsIDInclude(opt, req, foreignModel))
  }
  return options
}

function optionsIDInclude(opt, req, model, antecedent) {
  let options = {model: model.seq, required:true}
  let foreignModels = model.getForeignModels(opt.models)
  if (foreignModels.length > 0) {options.include = []}
  for (let i in foreignModels) {
    let foreignModel = foreignModels[i]
    options.include.push(optionsIDInclude(opt, req, foreignModel))
  }
  return options
}

function metadata(result, options) {
  let limit, offset, count, totalCount
  return {count: 100}
}

function output(opt, result) {
  return result
}

let utils = {
  optionsQUERY,
  optionsID,
  metadata,
  output
}

module.exports = utils
